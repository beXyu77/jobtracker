# backend/app/core/db.py
# sqlalchemy: Python SQL toolkit and Object Relational Mapper
from sqlalchemy import create_engine # 用于创建数据库引擎；底层：SQL、连接、引擎、事务
from sqlalchemy.orm import sessionmaker # 用于创建数据库会话；高层：ORM，对象化操作数据库

from .config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()