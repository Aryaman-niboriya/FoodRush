import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Enum,
    ForeignKey, DateTime, Text, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class FoodCategory(str, enum.Enum):
    STARTER     = "starter"
    MAIN_COURSE = "main_course"
    DESSERT     = "dessert"
    BEVERAGE    = "beverage"
    SNACK       = "snack"
    BREAD       = "bread"
    SALAD       = "salad"
    SOUP        = "soup"
    COMBO       = "combo"
    OTHER       = "other"


class MenuItem(Base):
    __tablename__ = "menu_items"

    id            = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    name          = Column(String(200), nullable=False, index=True)
    description   = Column(Text, nullable=True)
    category      = Column(Enum(FoodCategory), default=FoodCategory.OTHER)
    price         = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)        # sale price
    image_url     = Column(String(500), nullable=True)
    is_veg        = Column(Boolean, default=True)
    is_available  = Column(Boolean, default=True)
    is_featured   = Column(Boolean, default=False)
    avg_rating    = Column(Float, default=0.0)
    total_orders  = Column(Integer, default=0)
    calories      = Column(Integer, nullable=True)
    prep_time_min = Column(Integer, default=15)
    spice_level   = Column(Integer, default=0)           # 0–3
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    restaurant    = relationship("Restaurant", back_populates="menu_items")
    order_items   = relationship("OrderItem",  back_populates="menu_item", lazy="dynamic")

    @property
    def effective_price(self) -> float:
        return self.discount_price if self.discount_price else self.price

    def __repr__(self):
        return f"<MenuItem id={self.id} name={self.name} price={self.price}>"
