from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

from app.models.user import UserRole


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{7,14}$")
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole = UserRole.USER

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=120)
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    role: UserRole
    is_active: bool
    avatar_url: Optional[str]
    address: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    """Safe public profile (no email/phone)."""
    id: int
    full_name: str
    avatar_url: Optional[str]
    role: UserRole

    model_config = {"from_attributes": True}
