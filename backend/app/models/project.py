from sqlalchemy import Column, Integer, String
from app.db import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    created_by = Column(Integer , index = True)
    description = Column(String)