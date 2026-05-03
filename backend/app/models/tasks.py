

from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum
from datetime import datetime
from app.db import Base
from enum import Enum


class Status(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"
    
class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    title = Column(String, index=True)
    created_by = Column(Integer , index = True)
    description = Column(String)
    status = Column(SQLAlchemyEnum(Status), default=Status.todo)
    priority = Column(SQLAlchemyEnum(Priority), default=Priority.medium)
    assigned_to = Column(Integer, nullable=True, index=True)
    due_date = Column(datetime, nullable=True)