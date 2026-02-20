from datetime import date, timedelta
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.application import Application

router = APIRouter(prefix="/stats", tags=["stats"])

# 和你前端/后端保持一致（如果你后端已有 ALLOWED_STATUSES，最好抽到 common）
STATUSES = [
    "Draft",
    "Applied",
    "HR Screen",
    "Interview 1",
    "Interview 2+",
    "Offer",
    "Rejected",
    "Withdrawn",
]

CLOSED = ["Rejected", "Withdrawn"]
INTERVIEW = ["Interview 1", "Interview 2+"]


@router.get("/status")
def status_counts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Dict[str, int]:
    rows = (
        db.query(Application.status, func.count(Application.id))
        .filter(Application.user_id == user.id)
        .group_by(Application.status)
        .all()
    )
    counts = {s: 0 for s in STATUSES}
    for status, cnt in rows:
        counts[str(status)] = int(cnt)

    # total 也一起返回更方便
    counts["Total"] = sum(counts[s] for s in STATUSES)
    return counts


@router.get("/kpi")
def kpi(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    # 用 SUM(CASE WHEN ...) 一次性算出所有 KPI
    row = (
        db.query(
            func.count(Application.id).label("total"),
            func.sum(case((Application.status == "Offer", 1), else_=0)).label("offer"),
            func.sum(case((Application.status == "Rejected", 1), else_=0)).label("rejected"),
            func.sum(case((Application.status == "Withdrawn", 1), else_=0)).label("withdrawn"),
            func.sum(case((Application.status.in_(INTERVIEW), 1), else_=0)).label("interviewing"),
        )
        .filter(Application.user_id == user.id)
        .one()
    )

    total = int(row.total or 0)
    offer = int(row.offer or 0)
    rejected = int(row.rejected or 0)
    withdrawn = int(row.withdrawn or 0)
    interviewing = int(row.interviewing or 0)

    active = total - rejected - withdrawn

    offer_rate = (offer / total) if total else 0.0
    interview_rate = (interviewing / total) if total else 0.0

    return {
        "total": total,
        "active": active,
        "interviewing": interviewing,
        "offer": offer,
        "rejected": rejected,
        "withdrawn": withdrawn,
        "offer_rate": offer_rate,
        "interview_rate": interview_rate,
    }


@router.get("/applied_daily")
def applied_daily(
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    """
    返回近 N 天的 applied_at 统计（只统计 applied_at 不为空的记录）
    例：[{ "date": "2026-02-01", "count": 3 }, ...]
    """
    start = date.today() - timedelta(days=days - 1)

    rows = (
        db.query(Application.applied_at, func.count(Application.id))
        .filter(Application.user_id == user.id)
        .filter(Application.applied_at.isnot(None))
        .filter(Application.applied_at >= start)
        .group_by(Application.applied_at)
        .order_by(Application.applied_at.asc())
        .all()
    )

    # 补齐缺失日期（让前端画折线图更舒服）
    mapped = {r[0]: int(r[1]) for r in rows}  # date -> count
    out: List[Dict[str, Any]] = []
    for i in range(days):
        d = start + timedelta(days=i)
        out.append({"date": d.isoformat(), "count": mapped.get(d, 0)})

    return out