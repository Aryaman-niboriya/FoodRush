from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.jwt import get_current_active_user
from app.models.user import User
from app.schemas.restaurant import RestaurantCreate, RestaurantUpdate, RestaurantResponse, RestaurantList
from app.services import restaurant_service

router = APIRouter()


@router.post("/", response_model=RestaurantResponse, status_code=201)
def create_restaurant(
    payload: RestaurantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new restaurant. Authenticated users only."""
    return restaurant_service.create_restaurant(db, payload, current_user)


@router.get("/", response_model=RestaurantList)
def list_restaurants(
    city: Optional[str] = Query(None),
    cuisine: Optional[str] = Query(None),
    is_open: Optional[bool] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List restaurants with optional filters."""
    return restaurant_service.list_restaurants(db, city, cuisine, is_open, min_rating, page, size)


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    """Get a single restaurant by ID."""
    return restaurant_service.get_restaurant(db, restaurant_id)


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    payload: RestaurantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a restaurant. Owner or admin only."""
    return restaurant_service.update_restaurant(db, restaurant_id, payload, current_user)


@router.delete("/{restaurant_id}")
def delete_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Soft-delete a restaurant. Owner or admin only."""
    return restaurant_service.delete_restaurant(db, restaurant_id, current_user)
