from fastapi import APIRouter
from pydantic import BaseModel
from app.db import DbSession
from app.models.user import User

router = APIRouter()

class UserData(BaseModel):
    name : str
    email: str
    password: str
    
@router.post("/signup")
def signup(user_data: UserData, db: DbSession):
    
    user_exists = db.query(User).filter(User.email == user_data.email).first()
    
    if user_exists:
        return {"message": f"User with {user_data.email} already exists"}
    else:
        new_user = User(
            name = user_data.name,
            email = user_data.email,
            password = user_data.password  
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
        "message": "User created successfully",
        "name": user_data.name,
        "id": new_user.id
    }
    
    