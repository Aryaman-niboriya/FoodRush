from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.delivery import DeliveryStatus


class DeliveryAssign(BaseModel):
    partner_id: int
    notes: Optional[str] = None


class DeliveryStatusUpdate(BaseModel):
    status: DeliveryStatus
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    notes: Optional[str] = None
    failure_reason: Optional[str] = None


class DeliveryResponse(BaseModel):
    id: int
    order_id: int
    partner_id: int
    status: DeliveryStatus
    current_lat: Optional[float]
    current_lng: Optional[float]
    last_location_update: Optional[datetime]
    notes: Optional[str]
    failure_reason: Optional[str]
    assigned_at: datetime
    picked_up_at: Optional[datetime]
    delivered_at: Optional[datetime]

    model_config = {"from_attributes": True}
