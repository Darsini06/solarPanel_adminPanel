from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
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

router = APIRouter(prefix="/api", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

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
    """Dependency to get current user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    return user

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
