from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional

from app.models.restaurant import Restaurant
from app.models.user import User, UserRole
from app.schemas.restaurant import RestaurantCreate, RestaurantUpdate


def create_restaurant(db: Session, payload: RestaurantCreate, owner: User) -> Restaurant:
    restaurant = Restaurant(
        owner_id=owner.id,
        **payload.model_dump(),
    )
    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)
    return restaurant


def get_restaurant(db: Session, restaurant_id: int) -> Restaurant:
    r = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id,
        Restaurant.is_active == True,
    ).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return r


def list_restaurants(
    db: Session,
    city: Optional[str] = None,
    cuisine: Optional[str] = None,
    is_open: Optional[bool] = None,
    min_rating: Optional[float] = None,
    page: int = 1,
    size: int = 20,
):
    query = db.query(Restaurant).filter(Restaurant.is_active == True)
    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))
    if cuisine:
        query = query.filter(Restaurant.cuisine_type == cuisine)
    if is_open is not None:
        query = query.filter(Restaurant.is_open == is_open)
    if min_rating is not None:
        query = query.filter(Restaurant.avg_rating >= min_rating)
    total = query.count()
    items = query.order_by(Restaurant.avg_rating.desc()).offset((page - 1) * size).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": items}


def update_restaurant(
    db: Session,
    restaurant_id: int,
    payload: RestaurantUpdate,
    current_user: User,
) -> Restaurant:
    r = get_restaurant(db, restaurant_id)
    if r.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to update this restaurant")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)
    return r


def delete_restaurant(db: Session, restaurant_id: int, current_user: User) -> dict:
    r = get_restaurant(db, restaurant_id)
    if r.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    r.is_active = False
    db.commit()
    return {"message": "Restaurant deactivated"}
