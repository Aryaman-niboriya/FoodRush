from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from app.models.menu_item import MenuItem, FoodCategory
from app.models.restaurant import Restaurant
from app.models.user import User, UserRole
from app.schemas.menu_item import MenuItemCreate, MenuItemUpdate


def _assert_restaurant_owner(restaurant: Restaurant, current_user: User):
    if restaurant.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to manage this restaurant's menu")


def create_menu_item(
    db: Session,
    restaurant_id: int,
    payload: MenuItemCreate,
    current_user: User,
) -> MenuItem:
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id, Restaurant.is_active == True
    ).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    _assert_restaurant_owner(restaurant, current_user)

    item = MenuItem(restaurant_id=restaurant_id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_menu_item(db: Session, item_id: int) -> MenuItem:
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


def list_menu_items(
    db: Session,
    restaurant_id: int,
    category: Optional[FoodCategory] = None,
    is_veg: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    is_available: Optional[bool] = True,
):
    query = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id)
    if category:
        query = query.filter(MenuItem.category == category)
    if is_veg is not None:
        query = query.filter(MenuItem.is_veg == is_veg)
    if min_price is not None:
        query = query.filter(MenuItem.price >= min_price)
    if max_price is not None:
        query = query.filter(MenuItem.price <= max_price)
    if min_rating is not None:
        query = query.filter(MenuItem.avg_rating >= min_rating)
    if is_available is not None:
        query = query.filter(MenuItem.is_available == is_available)
    items = query.order_by(MenuItem.is_featured.desc(), MenuItem.avg_rating.desc()).all()
    return {"total": len(items), "items": items}


def update_menu_item(
    db: Session,
    item_id: int,
    payload: MenuItemUpdate,
    current_user: User,
) -> MenuItem:
    item = get_menu_item(db, item_id)
    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    _assert_restaurant_owner(restaurant, current_user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_menu_item(db: Session, item_id: int, current_user: User) -> dict:
    item = get_menu_item(db, item_id)
    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    _assert_restaurant_owner(restaurant, current_user)
    db.delete(item)
    db.commit()
    return {"message": "Menu item deleted"}
