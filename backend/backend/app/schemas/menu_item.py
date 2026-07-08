from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.models.menu_item import FoodCategory


class MenuItemCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    category: FoodCategory = FoodCategory.OTHER
    price: float = Field(..., gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    is_veg: bool = True
    is_available: bool = True
    is_featured: bool = False
    calories: Optional[int] = Field(None, ge=0)
    prep_time_min: int = Field(default=15, ge=1, le=180)
    spice_level: int = Field(default=0, ge=0, le=3)


class MenuItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    category: Optional[FoodCategory] = None
    price: Optional[float] = Field(None, gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    is_veg: Optional[bool] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    calories: Optional[int] = None
    prep_time_min: Optional[int] = Field(None, ge=1, le=180)
    spice_level: Optional[int] = Field(None, ge=0, le=3)


class MenuItemResponse(BaseModel):
    id: int
    restaurant_id: int
    name: str
    description: Optional[str]
    category: FoodCategory
    price: float
    discount_price: Optional[float]
    effective_price: float
    image_url: Optional[str]
    is_veg: bool
    is_available: bool
    is_featured: bool
    avg_rating: float
    total_orders: int
    calories: Optional[int]
    prep_time_min: int
    spice_level: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MenuItemList(BaseModel):
    total: int
    items: List[MenuItemResponse]
