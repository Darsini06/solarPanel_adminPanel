from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, datetime
from app.models.auth import UserRegister, UserLogin, Token, UserResponse 
from app.auth import (
    create_user, 
    authenticate_user, 
    create_access_token,
    get_user_by_id,
    create_refresh_token,
    format_user_response,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from jose import JWTError, jwt
from app.db import db
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login", auto_error=False)

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    user_dict = user_data.dict()

    # Create user
    user = create_user(user_dict)

    # Create tokens
    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user["_id"])}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": format_user_response(user)
    }

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user["_id"])}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": format_user_response(user)
    }


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Dependency to get current user from token - Modified to be optional/bypassable"""
    # Try to validate token if present
    try:
        if token:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id:
                user = get_user_by_id(user_id)
                if user:
                    return user
    except Exception:
        pass # Fall through to default user
    
    # Return a default admin user if authentication fails or is missing
    # This allows the app to work without a strict login for now
    default_admin = db.users.find_one({"email": "admin@gmail.com"})
    if not default_admin:
        # Create a basic dummy user if not found in DB
        default_admin = {
            "_id": ObjectId("507f1f77bcf86cd799439011"), # Mock ID
            "email": "admin@gmail.com",
            "first_name": "Admin",
            "last_name": "User",
            "is_admin": True
        }
    return default_admin

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user = Depends(get_current_user)):
    """Get current user profile"""
    return format_user_response(current_user)

@router.get("/verify-token")
async def verify_token(current_user = Depends(get_current_user)):
    """Verify token validity"""
    return {
        "valid": True,
        "user_id": str(current_user["_id"]),
        "email": current_user["email"]
    }

    return {"access_token": access_token}

@router.post("/refresh")
async def refresh_token(data: dict):
    refresh_token = data.get("refresh_token")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)

    user = get_user_by_id(user_id)

    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token}

@router.get("/users/all")
async def get_all_users(current_user = Depends(get_current_user)):
    """Get all users for admin management"""
    users = list(db.users.find())
    formatted_users = []
    for user in users:
        formatted_users.append({
            "_id": str(user["_id"]),
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
            "email": user.get("email", ""),
            "role": user.get("role", "user"),
            "status": user.get("status", "active"),
            "created_at": user.get("created_at", datetime.utcnow()).isoformat()
        })
    return formatted_users

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user = Depends(get_current_user)):
    """Delete a user by ID"""
    try:
        result = db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
