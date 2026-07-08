from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.jwt import get_current_active_user
from app.models.user import User
from app.models.menu_item import FoodCategory
from app.schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemResponse, MenuItemList
from app.services import menu_service

router = APIRouter()


@router.post("/{restaurant_id}/items", response_model=MenuItemResponse, status_code=201)
def create_menu_item(
    restaurant_id: int,
    payload: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Add a new menu item to a restaurant."""
    return menu_service.create_menu_item(db, restaurant_id, payload, current_user)


@router.get("/{restaurant_id}/items", response_model=MenuItemList)
def list_menu_items(
    restaurant_id: int,
    category: Optional[FoodCategory] = Query(None),
    is_veg: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    is_available: Optional[bool] = Query(True),
    db: Session = Depends(get_db),
):
    """List menu items for a restaurant with optional filters."""
    return menu_service.list_menu_items(
        db, restaurant_id, category, is_veg, min_price, max_price, min_rating, is_available
    )


@router.get("/items/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Get a single menu item by ID."""
    return menu_service.get_menu_item(db, item_id)


@router.put("/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    payload: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a menu item. Restaurant owner or admin only."""
    return menu_service.update_menu_item(db, item_id, payload, current_user)


@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a menu item. Restaurant owner or admin only."""
    return menu_service.delete_menu_item(db, item_id, current_user)
