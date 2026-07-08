import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Enum,
    ForeignKey, DateTime, Text, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class CuisineType(str, enum.Enum):
    INDIAN      = "indian"
    CHINESE     = "chinese"
    ITALIAN     = "italian"
    MEXICAN     = "mexican"
    AMERICAN    = "american"
    JAPANESE    = "japanese"
    THAI        = "thai"
    MEDITERRANEAN = "mediterranean"
    OTHER       = "other"


class Restaurant(Base):
    __tablename__ = "restaurants"

    id           = Column(Integer, primary_key=True, index=True)
    owner_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    name         = Column(String(200), nullable=False, index=True)
    description  = Column(Text, nullable=True)
    cuisine_type = Column(Enum(CuisineType), default=CuisineType.OTHER)
    address      = Column(String(500), nullable=False)
    city         = Column(String(100), nullable=False, index=True)
    latitude     = Column(Float, nullable=True)
    longitude    = Column(Float, nullable=True)
    phone        = Column(String(20), nullable=True)
    image_url    = Column(String(500), nullable=True)
    banner_url   = Column(String(500), nullable=True)
    is_open      = Column(Boolean, default=True)
    is_active    = Column(Boolean, default=True)
    avg_rating   = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    min_order    = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    delivery_time_min = Column(Integer, default=30)   # minutes
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner        = relationship("User",      back_populates="restaurants")
    menu_items   = relationship("MenuItem",  back_populates="restaurant", cascade="all, delete-orphan")
    orders       = relationship("Order",     back_populates="restaurant", lazy="dynamic")
    reviews      = relationship("Review",    back_populates="restaurant", lazy="dynamic")

    def __repr__(self):
        return f"<Restaurant id={self.id} name={self.name}>"
