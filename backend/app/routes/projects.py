
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.db import DbSession

from app.utils.dependencies import get_current_user
from app.models.project import Project
from app.models.user import User
from app.models.tasks import Status, Task
from app.models.project_members import ProjectMember, RoleEnum
from app.schemas.projectCreate import ProjectCreate
from app.schemas.taskCreate import TaskCreate, UpdateTaskStatus


def build_task_response(t , db : DbSession):
    assigned_user = db.query(User).filter(User.id == t.assigned_to).first() if t.assigned_to else None
    creator = db.query(User).filter(User.id == t.created_by).first()

    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "status": t.status.value,
        "priority": t.priority.value,
        "due_date": t.due_date,
        "assigned_to": {
            "id": assigned_user.id,
            "name": assigned_user.name
        } if assigned_user else None,
        "created_by": {
            "id": creator.id,
            "name": creator.name
        }
    }



router = APIRouter()

class AddMemberRequest(BaseModel):
    email: str


@router.get("/")
async def get_my_projects(
        db: DbSession,
        user_id: int = Depends(get_current_user)
    ):
    project_memberships = db.query(ProjectMember).filter(
        ProjectMember.user_id == user_id
    ).all()

    project_ids = [membership.project_id for membership in project_memberships]

    if not project_ids:
        return []

    projects = (
        db.query(Project, User.id, User.name)
        .join(User, Project.created_by == User.id)
        .filter(Project.id.in_(project_ids))
        .all()
    )

    return [
        {
            "id": project.id,
            "project_name": project.project_name,
            "description": project.description,
            "created_by": {
                "id": creator_id,
                "name": name
            }
        }
        for project, creator_id, name in projects
    ]

@router.get("/{project_id}")
async def get_project_details(
        project_id: int,
        db: DbSession,
        user_id: int = Depends(get_current_user)
    ):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")

    project = (
        db.query(Project, User.id, User.name)
        .join(User, Project.created_by == User.id)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project_obj, creator_id, name = project

    return {
        "id": project_obj.id,
        "project_name": project_obj.project_name,
        "description": project_obj.description,
        "created_by": {
            "id": creator_id,
            "name": name
        }
    }

@router.post("/")
async def create_project(
        project: ProjectCreate,
        db: DbSession,
        user_id: int = Depends(get_current_user)
    ):
    new_project = Project(
        project_name=project.project_name,
        description=project.description,
        created_by=user_id
    )

    db.add(new_project)
    db.flush()

    db.add(ProjectMember(
        project_id=new_project.id,
        user_id=user_id,
        role=RoleEnum.admin
    ))

    db.commit()

    return {
        "id": new_project.id,
        "project_name": new_project.project_name,
        "description": new_project.description,
        "created_by": {
            "id": user_id
        }
    }

@router.get("/{project_id}/members")
async def get_project_members(
    project_id: int,
    db: DbSession,
    user_id: int = Depends(get_current_user)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")

    members = (
        db.query(User.id, User.name, User.email, ProjectMember.role)
        .join(ProjectMember, User.id == ProjectMember.user_id)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "role": m.role.value
        }
        for m in members
    ]

@router.post("/{project_id}/members")
async def add_member(
    project_id: int,
    data: AddMemberRequest,
    db: DbSession,
    user_id: int = Depends(get_current_user)
):
    
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership or membership.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can add members.")

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    existing_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()

    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this project.")

    new_member = ProjectMember(
        project_id=project_id,
        user_id=user.id,
        role=RoleEnum.member
    )

    db.add(new_member)
    db.commit()

    return {
        "user_id": user.id,
        "project_id": project_id,
        "role": "member"
    }
    
@router.delete("/{project_id}/members/{target_user_id}")
async def remove_member(
    project_id: int,
    target_user_id: int,
    db: DbSession,
    current_user_id: int = Depends(get_current_user)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user_id
    ).first()

    if not membership or membership.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can remove members.")

    if target_user_id == current_user_id:
        raise HTTPException(status_code=400, detail="Admin cannot remove themselves.")

    member_to_remove = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == target_user_id
    ).first()

    if not member_to_remove:
        raise HTTPException(status_code=404, detail="User is not a member of this project.")

    db.delete(member_to_remove)
    db.commit()

    return {
        "message": "Member removed successfully",
        "user_id": target_user_id,
        "project_id": project_id
    }
      
@router.post("/{project_id}/tasks")
async def create_task(
    project_id: int,
    task_data: TaskCreate,
    db: DbSession,
    user_id: int = Depends(get_current_user)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")
    #validate user
    if task_data.assigned_to is not None:
        assigned_user = db.query(User).filter(User.id == task_data.assigned_to).first()

        if not assigned_user:
            raise HTTPException(status_code=404, detail="Assigned user not found.")

        assigned_membership = db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == task_data.assigned_to
        ).first()

        if not assigned_membership:
            raise HTTPException(status_code=400, detail="User is not part of this project.")

    new_task = Task(
            project_id=project_id,
            title=task_data.title,
            description=task_data.description,
            priority=task_data.priority,
            status=task_data.status,
            assigned_to=task_data.assigned_to,
            created_by=user_id,
            due_date=task_data.due_date
        )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return build_task_response(new_task, db)
    
@router.patch("/{project_id}/tasks/{task_id}")
async def update_task_status(
    project_id: int,
    task_id: int,
    status_update: UpdateTaskStatus,
    db: DbSession,
    user_id: int = Depends(get_current_user)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")
    
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.project_id == project_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    if not (
            task.assigned_to == user_id or
            membership.role == RoleEnum.admin or 
            task.assigned_to is None
        ):
        raise HTTPException(status_code=403, detail="Not allowed to update this task.")


    task.status = status_update.status
    db.commit()
    db.refresh(task)

    return build_task_response(task, db)
            

@router.get("/{project_id}/tasks")
async def get_tasks(
    project_id: int,
    db: DbSession,
    user_id: int = Depends(get_current_user),
    status: str | None = None,
    assigned_to: int | None = None
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")

    query = db.query(Task).filter(Task.project_id == project_id)

    if status:
        try:
            status_enum = Status(status)
        except:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        query = query.filter(Task.status == status_enum)

    if assigned_to is not None:
        query = query.filter(Task.assigned_to == assigned_to)

    tasks = query.all()
    
    todo = [t for t in tasks if t.status.value == "todo"]
    in_progress = [t for t in tasks if t.status.value == "in_progress"]
    done = [t for t in tasks if t.status.value == "done"]

    return {
        "todo": [build_task_response(t, db) for t in todo],
        "in_progress": [build_task_response(t, db) for t in in_progress],
        "done": [build_task_response(t, db) for t in done]
    }
    
@router.get("/{project_id}/dashboard")
async def get_dashboard(
    project_id: int,
    db: DbSession,
    user_id: int = Depends(get_current_user)
):
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this project.")

    total_tasks = db.query(Task).filter(Task.project_id == project_id).count()
    todo_tasks = db.query(Task).filter(Task.project_id == project_id, Task.status == Status.todo).count()
    in_progress_tasks = db.query(Task).filter(Task.project_id == project_id, Task.status == Status.in_progress).count()
    done_tasks = db.query(Task).filter(Task.project_id == project_id, Task.status == Status.done).count()

    return {
        "total_tasks": total_tasks,
        "by_status": {
            "todo": todo_tasks,
            "in_progress": in_progress_tasks,
            "done": done_tasks
        }
    }
