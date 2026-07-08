import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Enum,
    ForeignKey, DateTime, Text, JSON, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class OrderStatus(str, enum.Enum):
    PENDING    = "pending"
    CONFIRMED  = "confirmed"
    PREPARING  = "preparing"
    READY      = "ready"
    ON_THE_WAY = "on_the_way"
    DELIVERED  = "delivered"
    CANCELLED  = "cancelled"


class PaymentMethod(str, enum.Enum):
    CASH       = "cash"
    CARD       = "card"
    UPI        = "upi"
    WALLET     = "wallet"


class PaymentStatus(str, enum.Enum):
    PENDING    = "pending"
    PAID       = "paid"
    FAILED     = "failed"
    REFUNDED   = "refunded"


class Order(Base):
    __tablename__ = "orders"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id   = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    status          = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False, index=True)
    payment_method  = Column(Enum(PaymentMethod), default=PaymentMethod.CASH)
    payment_status  = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)

    # Financials
    subtotal        = Column(Float, nullable=False)
    delivery_fee    = Column(Float, default=0.0)
    discount        = Column(Float, default=0.0)
    taxes           = Column(Float, default=0.0)
    total_amount    = Column(Float, nullable=False)

    # Delivery info
    delivery_address = Column(String(500), nullable=False)
    delivery_lat     = Column(Float, nullable=True)
    delivery_lng     = Column(Float, nullable=True)
    special_instructions = Column(Text, nullable=True)

    # Timestamps
    placed_at       = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at    = Column(DateTime(timezone=True), nullable=True)
    delivered_at    = Column(DateTime(timezone=True), nullable=True)
    estimated_delivery = Column(DateTime(timezone=True), nullable=True)
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user            = relationship("User",       back_populates="orders")
    restaurant      = relationship("Restaurant", back_populates="orders")
    items           = relationship("OrderItem",  back_populates="order", cascade="all, delete-orphan")
    delivery        = relationship("Delivery",   back_populates="order", uselist=False)
    review          = relationship("Review",     back_populates="order", uselist=False)

    def __repr__(self):
        return f"<Order id={self.id} status={self.status} total={self.total_amount}>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id            = Column(Integer, primary_key=True, index=True)
    order_id      = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id  = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity      = Column(Integer, nullable=False, default=1)
    unit_price    = Column(Float, nullable=False)    # snapshot at time of order
    item_name     = Column(String(200), nullable=False)  # snapshot
    customizations = Column(JSON, nullable=True)         # {"extra": "cheese", "no": "onions"}

    # Relationships
    order         = relationship("Order",    back_populates="items")
    menu_item     = relationship("MenuItem", back_populates="order_items")

    @property
    def subtotal(self) -> float:
        return self.unit_price * self.quantity

    def __repr__(self):
        return f"<OrderItem order={self.order_id} item={self.item_name} qty={self.quantity}>"
