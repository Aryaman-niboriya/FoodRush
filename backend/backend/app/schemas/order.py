from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.order import OrderStatus, PaymentMethod, PaymentStatus


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., ge=1, le=50)
    customizations: Optional[Dict[str, Any]] = None


class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[OrderItemCreate] = Field(..., min_length=1)
    delivery_address: str = Field(..., min_length=5)
    delivery_lat: Optional[float] = None
    delivery_lng: Optional[float] = None
    payment_method: PaymentMethod = PaymentMethod.CASH
    special_instructions: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    item_name: str
    quantity: int
    unit_price: float
    subtotal: float
    customizations: Optional[Dict[str, Any]]

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: int
    restaurant_id: int
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    subtotal: float
    delivery_fee: float
    discount: float
    taxes: float
    total_amount: float
    delivery_address: str
    special_instructions: Optional[str]
    items: List[OrderItemResponse]
    placed_at: datetime
    confirmed_at: Optional[datetime]
    delivered_at: Optional[datetime]
    estimated_delivery: Optional[datetime]

    model_config = {"from_attributes": True}


class OrderList(BaseModel):
    total: int
    page: int
    size: int
    items: List[OrderResponse]
