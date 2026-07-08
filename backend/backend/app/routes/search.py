from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.schemas.search import SearchResults
from app.services import search_service

router = APIRouter()


@router.get("/", response_model=SearchResults)
def search(
    q: str = Query(..., min_length=1, max_length=200, description="Search query"),
    city: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_veg: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Full-text search across dish names AND restaurant names.
    Dishes are returned as the primary result; matching restaurants as secondary.
    """
    return search_service.search(
        db, q, city, category, is_veg, min_price, max_price, min_rating, page, size
    )
