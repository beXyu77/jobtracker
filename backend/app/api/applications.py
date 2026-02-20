from datetime import date, datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.application import Application
from app.models.status_log import ApplicationStatusLog

from typing import Optional, List, Dict, Any
from fastapi import Query
from sqlalchemy import or_

router = APIRouter(prefix="/applications", tags=["applications"])

ALLOWED_STATUSES = [
    "Draft",
    "Applied",
    "HR Screen",
    "Interview 1",
    "Interview 2+",
    "Offer",
    "Rejected",
    "Withdrawn",
]


class ApplicationCreate(BaseModel):
    company: str = Field(min_length=1, max_length=255)
    position: str = Field(min_length=1, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    platform: Optional[str] = Field(default=None, max_length=120)
    url: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="Applied", max_length=50)
    applied_at: Optional[date] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(default=None, min_length=1, max_length=255)
    position: Optional[str] = Field(default=None, min_length=1, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    platform: Optional[str] = Field(default=None, max_length=120)
    url: Optional[str] = Field(default=None, max_length=1000)
    applied_at: Optional[date] = None
    notes: Optional[str] = None


class StatusChange(BaseModel):
    to_status: str = Field(max_length=50)
    note: Optional[str] = None


class StatusLogOut(BaseModel):
    id: int
    from_status: Optional[str]
    to_status: str
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationOut(BaseModel):
    id: int
    company: str
    position: str
    location: Optional[str]
    platform: Optional[str]
    url: Optional[str]
    status: str
    applied_at: Optional[date]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationDetailOut(ApplicationOut):
    status_logs: List[StatusLogOut] = []

    class Config:
        from_attributes = True
        
def _ensure_status(status: str):
    if status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {ALLOWED_STATUSES}")


def _get_owned_application(db: Session, user_id: int, app_id: int) -> Application:
    app = db.query(Application).filter(Application.id == app_id, Application.user_id == user_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.get("")
def list_applications(
    q: Optional[str] = Query(default=None, max_length=200),
    status: Optional[str] = Query(default=None, max_length=50),
    sort: str = Query(default="updated_desc"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    query = db.query(Application).filter(Application.user_id == user.id)

    if status:
        query = query.filter(Application.status == status)

    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Application.company.ilike(like),
                Application.position.ilike(like),
                Application.location.ilike(like),
                Application.platform.ilike(like),
            )
        )

    # 排序
    if sort == "updated_asc":
        query = query.order_by(Application.updated_at.asc())
    elif sort == "applied_desc":
        query = query.order_by(Application.applied_at.desc().nullslast())
    elif sort == "applied_asc":
        query = query.order_by(Application.applied_at.asc().nullsfirst())
    else:  # updated_desc
        query = query.order_by(Application.updated_at.desc())

    total = query.count()

    items = (
        query.offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total,
    }


@router.post("", response_model=ApplicationOut)
def create_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _ensure_status(data.status)

    app = Application(
        user_id=user.id,
        company=data.company,
        position=data.position,
        location=data.location,
        platform=data.platform,
        url=data.url,
        status=data.status,
        applied_at=data.applied_at,
        notes=data.notes,
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    # 初始状态也写入 log（很关键：后期统计/时间线靠它）
    log = ApplicationStatusLog(
        application_id=app.id,
        from_status=None,
        to_status=app.status,
        note="created",
    )
    db.add(log)
    db.commit()

    return app


@router.get("/{app_id}", response_model=ApplicationDetailOut)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app = _get_owned_application(db, user.id, app_id)
    # 让 logs 按时间排序
    app.status_logs.sort(key=lambda x: x.created_at)
    return app


@router.patch("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: int,
    data: ApplicationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app = _get_owned_application(db, user.id, app_id)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)

    db.commit()
    db.refresh(app)
    return app


@router.post("/{app_id}/status", response_model=ApplicationOut)
def change_status(
    app_id: int,
    data: StatusChange,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _ensure_status(data.to_status)

    app = _get_owned_application(db, user.id, app_id)
    from_status = app.status
    to_status = data.to_status

    if from_status == to_status:
        return app

    app.status = to_status
    db.add(app)

    log = ApplicationStatusLog(
        application_id=app.id,
        from_status=from_status,
        to_status=to_status,
        note=data.note,
    )
    db.add(log)

    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}")
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    app = _get_owned_application(db, user.id, app_id)
    db.delete(app)
    db.commit()
    return {"message": "deleted"}