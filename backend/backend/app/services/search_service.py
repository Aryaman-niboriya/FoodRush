from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.models.menu_item import MenuItem
from app.models.restaurant import Restaurant


def search(
    db: Session,
    q: str,
    city: Optional[str] = None,
    category: Optional[str] = None,
    is_veg: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    page: int = 1,
    size: int = 20,
):
    offset = (page - 1) * size
    pattern = f"%{q}%"

    # ── Dish search (primary) ──────────────────────────────────────────────
    dish_query = (
        db.query(MenuItem)
        .join(Restaurant, MenuItem.restaurant_id == Restaurant.id)
        .filter(
            MenuItem.name.ilike(pattern),
            MenuItem.is_available == True,
            Restaurant.is_active == True,
        )
    )
    if is_veg is not None:
        dish_query = dish_query.filter(MenuItem.is_veg == is_veg)
    if category:
        dish_query = dish_query.filter(MenuItem.category == category)
    if min_price is not None:
        dish_query = dish_query.filter(MenuItem.price >= min_price)
    if max_price is not None:
        dish_query = dish_query.filter(MenuItem.price <= max_price)
    if min_rating is not None:
        dish_query = dish_query.filter(MenuItem.avg_rating >= min_rating)
    if city:
        dish_query = dish_query.filter(Restaurant.city.ilike(f"%{city}%"))

    total_dishes = dish_query.count()
    dishes = (
        dish_query
        .order_by(MenuItem.total_orders.desc(), MenuItem.avg_rating.desc())
        .offset(offset)
        .limit(size)
        .all()
    )

    # ── Restaurant search (secondary) ─────────────────────────────────────
    rest_query = db.query(Restaurant).filter(
        or_(
            Restaurant.name.ilike(pattern),
            Restaurant.description.ilike(pattern),
        ),
        Restaurant.is_active == True,
    )
    if city:
        rest_query = rest_query.filter(Restaurant.city.ilike(f"%{city}%"))
    if min_rating is not None:
        rest_query = rest_query.filter(Restaurant.avg_rating >= min_rating)

    total_restaurants = rest_query.count()
    restaurants = (
        rest_query
        .order_by(Restaurant.avg_rating.desc())
        .limit(10)
        .all()
    )

    return {
        "query": q,
        "total_dishes": total_dishes,
        "total_restaurants": total_restaurants,
        "dishes": dishes,
        "restaurants": restaurants,
    }
