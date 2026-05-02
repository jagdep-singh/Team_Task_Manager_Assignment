from pydantic import BaseModel
from app.models.tasks import Priority, Status

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: Priority = Priority.medium
    status: Status = Status.todo
    assigned_to: int | None = None

    class Config:
        from_attributes = True
        
        
class UpdateTaskStatus(BaseModel):
    status: Status
    
    class Config:
        from_attributes = True