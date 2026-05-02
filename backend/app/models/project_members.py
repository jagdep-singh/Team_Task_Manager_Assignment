from sqlalchemy import Column, Integer, Enum as SQLAlchemyEnum
from app.db import Base
from enum import Enum


class RoleEnum(str, Enum):
    admin = "admin"
    member = "member"


class ProjectMember(Base):
    __tablename__ = "project_members"

    user_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, primary_key=True)
    role = Column(SQLAlchemyEnum(RoleEnum), nullable=False)