from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.db import Base, engine, SessionLocal
from app.models.user import User

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "submission by Jagdeep Singh"}


@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.post("/")
def PingPong(msg : str):
    if msg == "ping":
        return {"message": "pong"}
    else:
        return {"message": "should have sent ping"}


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User.id, User.name, User.email).all()