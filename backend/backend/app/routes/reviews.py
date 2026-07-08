from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.jwt import get_current_active_user
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewList
from app.services import review_service

router = APIRouter()


@router.post("/", response_model=ReviewResponse, status_code=201)
def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Submit a review for a restaurant."""
    return review_service.create_review(db, payload, current_user)


@router.get("/restaurant/{restaurant_id}", response_model=ReviewList)
def list_reviews(
    restaurant_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all reviews for a restaurant."""
    return review_service.list_reviews(db, restaurant_id, page, size)


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Soft-delete a review. Owner or admin only."""
    return review_service.delete_review(db, review_id, current_user)
