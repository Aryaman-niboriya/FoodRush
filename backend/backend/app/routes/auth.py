from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, RefreshResponse
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    user = auth_service.register_user(db, payload)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and receive JWT tokens."""
    return auth_service.login_user(db, payload)


@router.post("/refresh", response_model=RefreshResponse)
def refresh_token(payload: RefreshRequest):
    """Exchange a refresh token for a new access token."""
    return auth_service.refresh_access_token(payload)
