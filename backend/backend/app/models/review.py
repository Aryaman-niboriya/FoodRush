from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    ForeignKey, DateTime, Text, UniqueConstraint, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    order_id      = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=True)
    rating        = Column(Float, nullable=False)        # 1.0 – 5.0
    food_rating   = Column(Float, nullable=True)
    delivery_rating = Column(Float, nullable=True)
    comment       = Column(Text, nullable=True)
    image_url     = Column(String(500), nullable=True)
    is_verified   = Column(Boolean, default=False)       # True if tied to a real order
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "restaurant_id", "order_id", name="uq_user_restaurant_order_review"),
    )

    # Relationships
    user          = relationship("User",       back_populates="reviews")
    restaurant    = relationship("Restaurant", back_populates="reviews")
    order         = relationship("Order",      back_populates="review")

    def __repr__(self):
        return f"<Review id={self.id} rating={self.rating} restaurant={self.restaurant_id}>"
