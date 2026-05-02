
from fastapi import FastAPI, Depends

from app.db import Base, engine, SessionLocal , get_db , DbSession
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.projects import router as projects_router
from app.utils.dependencies import get_current_user

app = FastAPI()
app.include_router(auth_router , prefix="/auth") #auth.py
app.include_router(projects_router , prefix="/project") #projects.py

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "submission by Jagdeep Singh"}

@app.get("/users")
def get_users(
        db: DbSession,
        user_id: int = Depends(get_current_user)
    ):
    users = db.query(User.id, User.name, User.email).all()
    return [
            {
                "id": u.id, 
                "name": u.name, 
                "email": u.email
            } 
        for u in users
    ]