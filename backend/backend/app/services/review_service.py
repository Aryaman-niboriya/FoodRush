from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from app.models.review import Review
from app.models.restaurant import Restaurant
from app.models.order import Order, OrderStatus
from app.models.user import User
from app.schemas.review import ReviewCreate


def _recalculate_restaurant_rating(db: Session, restaurant_id: int):
    """Recalculate and persist avg_rating and total_reviews for a restaurant."""
    result = db.query(
        func.avg(Review.rating).label("avg"),
        func.count(Review.id).label("count"),
    ).filter(
        Review.restaurant_id == restaurant_id,
        Review.is_active == True,
    ).one()
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if restaurant:
        restaurant.avg_rating = round(float(result.avg or 0), 2)
        restaurant.total_reviews = result.count or 0


def create_review(db: Session, payload: ReviewCreate, current_user: User) -> Review:
    # Check restaurant exists
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == payload.restaurant_id, Restaurant.is_active == True
    ).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    # One review per user per restaurant per order
    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.restaurant_id == payload.restaurant_id,
        Review.order_id == payload.order_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Review already submitted")

    is_verified = False
    if payload.order_id:
        order = db.query(Order).filter(
            Order.id == payload.order_id,
            Order.user_id == current_user.id,
            Order.restaurant_id == payload.restaurant_id,
            Order.status == OrderStatus.DELIVERED,
        ).first()
        if not order:
            raise HTTPException(
                status_code=400,
                detail="Order not found, not yours, or not yet delivered",
            )
        is_verified = True

    review = Review(
        user_id=current_user.id,
        restaurant_id=payload.restaurant_id,
        order_id=payload.order_id,
        rating=payload.rating,
        food_rating=payload.food_rating,
        delivery_rating=payload.delivery_rating,
        comment=payload.comment,
        image_url=payload.image_url,
        is_verified=is_verified,
    )
    db.add(review)
    _recalculate_restaurant_rating(db, payload.restaurant_id)
    db.commit()
    db.refresh(review)
    return review


def list_reviews(
    db: Session,
    restaurant_id: int,
    page: int = 1,
    size: int = 20,
):
    query = db.query(Review).filter(
        Review.restaurant_id == restaurant_id,
        Review.is_active == True,
    )
    total = query.count()
    avg = db.query(func.avg(Review.rating)).filter(
        Review.restaurant_id == restaurant_id, Review.is_active == True
    ).scalar() or 0.0

    items = query.order_by(Review.created_at.desc()).offset((page - 1) * size).limit(size).all()
    return {
        "total": total,
        "avg_rating": round(float(avg), 2),
        "page": page,
        "size": size,
        "items": items,
    }


def delete_review(db: Session, review_id: int, current_user: User) -> dict:
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    review.is_active = False
    _recalculate_restaurant_rating(db, review.restaurant_id)
    db.commit()
    return {"message": "Review removed"}
