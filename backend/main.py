from fastapi import FastAPI, Depends

from app.db import Base, engine, SessionLocal , get_db , DbSession
from app.models.user import User
from app.routes.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router , prefix="/auth") #auth.py

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "submission by Jagdeep Singh"}

@app.get("/users")
def get_users(db: DbSession):
    users = db.query(User.id, User.name, User.email).all()
    print(users)
    return [
            {
                "id": u.id, 
                "name": u.name, 
                "email": u.email
            } 
        for u in users
    ]