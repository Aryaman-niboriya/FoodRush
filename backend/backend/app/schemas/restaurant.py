from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.models.restaurant import CuisineType


class RestaurantCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    cuisine_type: CuisineType = CuisineType.OTHER
    address: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    min_order: float = Field(default=0.0, ge=0)
    delivery_fee: float = Field(default=0.0, ge=0)
    delivery_time_min: int = Field(default=30, ge=5, le=180)


class RestaurantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    cuisine_type: Optional[CuisineType] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    is_open: Optional[bool] = None
    min_order: Optional[float] = Field(None, ge=0)
    delivery_fee: Optional[float] = Field(None, ge=0)
    delivery_time_min: Optional[int] = Field(None, ge=5, le=180)


class RestaurantResponse(BaseModel):
    id: int
    owner_id: int
    name: str
    description: Optional[str]
    cuisine_type: CuisineType
    address: str
    city: str
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    image_url: Optional[str]
    banner_url: Optional[str]
    is_open: bool
    is_active: bool
    avg_rating: float
    total_reviews: int
    min_order: float
    delivery_fee: float
    delivery_time_min: int
    created_at: datetime

    model_config = {"from_attributes": True}


class RestaurantList(BaseModel):
    total: int
    page: int
    size: int
    items: List[RestaurantResponse]
