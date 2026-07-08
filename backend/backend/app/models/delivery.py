import enum
from sqlalchemy import (
    Column, Integer, String, Float, Enum,
    ForeignKey, DateTime, Text, func
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class DeliveryStatus(str, enum.Enum):
    ASSIGNED   = "assigned"
    PICKED_UP  = "picked_up"
    ON_THE_WAY = "on_the_way"
    DELIVERED  = "delivered"
    FAILED     = "failed"


class Delivery(Base):
    __tablename__ = "deliveries"

    id             = Column(Integer, primary_key=True, index=True)
    order_id       = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    partner_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    status         = Column(Enum(DeliveryStatus), default=DeliveryStatus.ASSIGNED, index=True)

    # Live location snapshot
    current_lat    = Column(Float, nullable=True)
    current_lng    = Column(Float, nullable=True)
    last_location_update = Column(DateTime(timezone=True), nullable=True)

    # Notes
    notes          = Column(Text, nullable=True)
    failure_reason = Column(String(300), nullable=True)

    # Timestamps
    assigned_at    = Column(DateTime(timezone=True), server_default=func.now())
    picked_up_at   = Column(DateTime(timezone=True), nullable=True)
    delivered_at   = Column(DateTime(timezone=True), nullable=True)
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order          = relationship("Order",   back_populates="delivery")
    partner        = relationship("User",    back_populates="delivery_jobs")

    def __repr__(self):
        return f"<Delivery id={self.id} order={self.order_id} partner={self.partner_id}>"
