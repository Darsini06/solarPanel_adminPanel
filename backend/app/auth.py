from datetime import datetime, timedelta
from typing import Optional
import os
from jose import jwt
import bcrypt
from bson import ObjectId
from fastapi import HTTPException, status
from app.db import db

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15   # short-lived
REFRESH_TOKEN_EXPIRE_DAYS = 30     # long-lived

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_user(user_data: dict):
    """Create a new user in database"""
    # Check if user already exists
    existing_user = db.users.find_one({"email": user_data["email"].lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    user_data["password"] = hash_password(user_data["password"])
    user_data["email"] = user_data["email"].lower()
    user_data["created_at"] = datetime.utcnow()
    
    # Insert user
    result = db.users.insert_one(user_data)
    
    # Return user with ID
    user_data["_id"] = result.inserted_id
    return user_data

def authenticate_user(email: str, password: str):
    """Authenticate user with email and password"""
    user = db.users.find_one({"email": email.lower()})
    if not user:
        return None
    
    if not verify_password(password, user["password"]):
        return None
    
    return user

def get_user_by_id(user_id: str):
    """Get user by ID"""
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        return user
    except:
        return None

def format_user_response(user):
    """Format user response (remove password)"""
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "created_at": user["created_at"].isoformat()
    }