from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.menu_item import MenuItemResponse
from app.schemas.restaurant import RestaurantResponse


class SearchQuery(BaseModel):
    q: str = Field(..., min_length=1, max_length=200)
    city: Optional[str] = None
    category: Optional[str] = None
    is_veg: Optional[bool] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)


class SearchResults(BaseModel):
    query: str
    total_dishes: int
    total_restaurants: int
    dishes: List[MenuItemResponse]
    restaurants: List[RestaurantResponse]
