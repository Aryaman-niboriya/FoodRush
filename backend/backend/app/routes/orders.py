from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.core.jwt import get_current_active_user, require_admin
from app.models.user import User
from app.models.order import OrderStatus
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse, OrderList
from app.services import order_service

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=201)
def place_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Place a new food order."""
    return order_service.place_order(db, payload, current_user)


@router.get("/history", response_model=OrderList)
def order_history(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[OrderStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get the current user's order history."""
    return order_service.get_order_history(db, current_user, page, size, status)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get order details and current status."""
    return order_service.get_order(db, order_id, current_user)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update order status (restaurant owner or admin)."""
    return order_service.update_order_status(db, order_id, payload, current_user)


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Cancel a pending order."""
    return order_service.cancel_order(db, order_id, current_user)


@router.get("/restaurant/{restaurant_id}", response_model=OrderList)
def restaurant_orders(
    restaurant_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    order_status: Optional[OrderStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """[Restaurant owner / admin] List all orders for a restaurant."""
    return order_service.get_restaurant_orders(db, restaurant_id, current_user, page, size, order_status)
