from fastapi import APIRouter


from app.db import DbSession
from app.models.user import User
from app.schemas.userCreate import UserCreate
from app.schemas.userLogin import UserLogin
from app.utils.encryption import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

router = APIRouter()
    
@router.post("/signup")
async def signup(user_data: UserCreate, db: DbSession):
    #user check
    user_exists = db.query(User).filter(User.email == user_data.email).first()
    
    if user_exists:
        return {"message": f"User with {user_data.email} already exists"}
    else:
        new_user = User(
            name = user_data.name,
            email = user_data.email,
            password = hash_password(user_data.password)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully",
            "name": user_data.name,
            "id": new_user.id
        }
    
@router.post("/login")
async def login(user_data: UserLogin, db: DbSession):
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user:
        return {"message": "User Does not exist"}
    
    if verify_password(user_data.password, user.password):
        token = create_access_token(user.id)
        return {
                "token": token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            }
    else:
        return {"message": "wrong password"}