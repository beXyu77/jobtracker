# backend/app/core/db.py
# sqlalchemy: Python SQL toolkit and Object Relational Mapper
from sqlalchemy import create_engine # 用于创建数据库引擎；底层：SQL、连接、引擎、事务
from sqlalchemy.orm import sessionmaker # 用于创建数据库会话；高层：ORM，对象化操作数据库
from sqlalchemy.orm import declarative_base # 用于定义ORM模型的基类；提供了一个基础类，所有ORM模型都应该继承自这个基类

from .config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()