import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, DateTime, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    USER     = "user"
    ADMIN    = "admin"
    DELIVERY = "delivery"


class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    full_name      = Column(String(120), nullable=False)
    email          = Column(String(255), unique=True, index=True, nullable=False)
    phone          = Column(String(20), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role           = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active      = Column(Boolean, default=True)
    avatar_url     = Column(String(500), nullable=True)
    address        = Column(String(500), nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    orders         = relationship("Order",    back_populates="user",     lazy="dynamic")
    reviews        = relationship("Review",   back_populates="user",     lazy="dynamic")
    delivery_jobs  = relationship("Delivery", back_populates="partner",  lazy="dynamic")
    restaurants    = relationship("Restaurant", back_populates="owner",  lazy="dynamic")

    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role}>"
