from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ReviewCreate(BaseModel):
    restaurant_id: int
    order_id: Optional[int] = None
    rating: float = Field(..., ge=1.0, le=5.0)
    food_rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    delivery_rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    comment: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    restaurant_id: int
    order_id: Optional[int]
    rating: float
    food_rating: Optional[float]
    delivery_rating: Optional[float]
    comment: Optional[str]
    image_url: Optional[str]
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewList(BaseModel):
    total: int
    avg_rating: float
    page: int
    size: int
    items: List[ReviewResponse]
