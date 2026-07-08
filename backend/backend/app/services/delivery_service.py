from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.delivery import Delivery, DeliveryStatus
from app.models.order import Order, OrderStatus
from app.models.user import User, UserRole
from app.schemas.delivery import DeliveryAssign, DeliveryStatusUpdate


def assign_delivery(
    db: Session,
    order_id: int,
    payload: DeliveryAssign,
    current_user: User,
) -> Delivery:
    # Only admin can assign
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY]:
        raise HTTPException(status_code=400, detail="Order not ready for delivery assignment")

    existing = db.query(Delivery).filter(Delivery.order_id == order_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Delivery already assigned for this order")

    # Validate partner
    partner = db.query(User).filter(
        User.id == payload.partner_id,
        User.is_active == True,
        User.role == UserRole.DELIVERY,
    ).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found")

    delivery = Delivery(
        order_id=order_id,
        partner_id=payload.partner_id,
        notes=payload.notes,
    )
    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    return delivery


def update_delivery_status(
    db: Session,
    delivery_id: int,
    payload: DeliveryStatusUpdate,
    current_user: User,
) -> Delivery:
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    # Only the assigned partner or admin can update
    if delivery.partner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")

    delivery.status = payload.status

    now = datetime.now(timezone.utc)

    if payload.current_lat is not None:
        delivery.current_lat = payload.current_lat
    if payload.current_lng is not None:
        delivery.current_lng = payload.current_lng
    if payload.current_lat or payload.current_lng:
        delivery.last_location_update = now

    if payload.notes:
        delivery.notes = payload.notes
    if payload.failure_reason:
        delivery.failure_reason = payload.failure_reason

    if payload.status == DeliveryStatus.PICKED_UP:
        delivery.picked_up_at = now
    elif payload.status == DeliveryStatus.ON_THE_WAY:
        # Sync order status
        order = db.query(Order).filter(Order.id == delivery.order_id).first()
        if order:
            order.status = OrderStatus.ON_THE_WAY
    elif payload.status == DeliveryStatus.DELIVERED:
        delivery.delivered_at = now
        order = db.query(Order).filter(Order.id == delivery.order_id).first()
        if order:
            order.status = OrderStatus.DELIVERED
            order.delivered_at = now

    db.commit()
    db.refresh(delivery)
    return delivery


def get_delivery_by_order(db: Session, order_id: int, current_user: User) -> Delivery:
    delivery = db.query(Delivery).filter(Delivery.order_id == order_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found for this order")
    return delivery


def get_partner_deliveries(
    db: Session,
    partner_id: int,
    current_user: User,
    page: int = 1,
    size: int = 20,
):
    if current_user.id != partner_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    query = db.query(Delivery).filter(Delivery.partner_id == partner_id)
    total = query.count()
    items = query.order_by(Delivery.assigned_at.desc()).offset((page - 1) * size).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": items}
