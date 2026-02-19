from sqlalchemy import Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.db import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)

    location = Column(String(255), nullable=True)
    platform = Column(String(120), nullable=True)
    url = Column(String(1000), nullable=True)

    status = Column(String(50), nullable=False, default="Applied")

    applied_at = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    status_logs = relationship("ApplicationStatusLog", back_populates="application", cascade="all, delete-orphan")