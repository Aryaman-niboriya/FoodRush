from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.jwt import get_current_active_user, require_admin
from app.models.user import User
from app.schemas.delivery import DeliveryAssign, DeliveryStatusUpdate, DeliveryResponse
from app.services import delivery_service

router = APIRouter()


@router.post("/orders/{order_id}/assign", response_model=DeliveryResponse, status_code=201)
def assign_delivery(
    order_id: int,
    payload: DeliveryAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """[Admin] Assign a delivery partner to an order."""
    return delivery_service.assign_delivery(db, order_id, payload, current_user)


@router.get("/orders/{order_id}", response_model=DeliveryResponse)
def get_delivery_by_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get delivery details for a given order."""
    return delivery_service.get_delivery_by_order(db, order_id, current_user)


@router.patch("/{delivery_id}/status", response_model=DeliveryResponse)
def update_delivery_status(
    delivery_id: int,
    payload: DeliveryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """[Delivery partner / admin] Update live delivery status and location."""
    return delivery_service.update_delivery_status(db, delivery_id, payload, current_user)


@router.get("/partner/{partner_id}")
def partner_deliveries(
    partner_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all deliveries assigned to a delivery partner."""
    return delivery_service.get_partner_deliveries(db, partner_id, current_user, page, size)
