from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional

from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.menu_item import MenuItem
from app.models.restaurant import Restaurant
from app.models.user import User, UserRole
from app.schemas.order import OrderCreate, OrderStatusUpdate

# Tax rate
TAX_RATE = 0.05   # 5 %


def place_order(db: Session, payload: OrderCreate, current_user: User) -> Order:
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == payload.restaurant_id, Restaurant.is_active == True
    ).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if not restaurant.is_open:
        raise HTTPException(status_code=400, detail="Restaurant is currently closed")

    # Build order items and calculate totals
    order_items = []
    subtotal = 0.0

    for item_data in payload.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_data.menu_item_id,
            MenuItem.restaurant_id == payload.restaurant_id,
            MenuItem.is_available == True,
        ).first()
        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=f"Menu item {item_data.menu_item_id} not found or unavailable",
            )
        unit_price = menu_item.effective_price
        subtotal += unit_price * item_data.quantity
        order_items.append(
            OrderItem(
                menu_item_id=menu_item.id,
                item_name=menu_item.name,
                quantity=item_data.quantity,
                unit_price=unit_price,
                customizations=item_data.customizations,
            )
        )

    if subtotal < restaurant.min_order:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order amount is ₹{restaurant.min_order}",
        )

    delivery_fee = restaurant.delivery_fee
    taxes = round((subtotal + delivery_fee) * TAX_RATE, 2)
    total_amount = round(subtotal + delivery_fee + taxes, 2)

    estimated_delivery = datetime.now(timezone.utc) + timedelta(
        minutes=restaurant.delivery_time_min + 10
    )

    order = Order(
        user_id=current_user.id,
        restaurant_id=payload.restaurant_id,
        delivery_address=payload.delivery_address,
        delivery_lat=payload.delivery_lat,
        delivery_lng=payload.delivery_lng,
        payment_method=payload.payment_method,
        special_instructions=payload.special_instructions,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        taxes=taxes,
        total_amount=total_amount,
        estimated_delivery=estimated_delivery,
        items=order_items,
    )
    db.add(order)

    # Increment total_orders for each menu item
    for oi in order_items:
        db.query(MenuItem).filter(MenuItem.id == oi.menu_item_id).update(
            {MenuItem.total_orders: MenuItem.total_orders + oi.quantity}
        )

    db.commit()
    db.refresh(order)
    return order


def get_order(db: Session, order_id: int, current_user: User) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Users can only see their own orders; admins and delivery can see all
    if (
        current_user.role == UserRole.USER
        and order.user_id != current_user.id
    ):
        raise HTTPException(status_code=403, detail="Access denied")
    return order


def update_order_status(
    db: Session,
    order_id: int,
    payload: OrderStatusUpdate,
    current_user: User,
) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Enforce valid state transitions
    valid_transitions = {
        OrderStatus.PENDING:    [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        OrderStatus.CONFIRMED:  [OrderStatus.PREPARING, OrderStatus.CANCELLED],
        OrderStatus.PREPARING:  [OrderStatus.READY],
        OrderStatus.READY:      [OrderStatus.ON_THE_WAY],
        OrderStatus.ON_THE_WAY: [OrderStatus.DELIVERED],
        OrderStatus.DELIVERED:  [],
        OrderStatus.CANCELLED:  [],
    }
    if payload.status not in valid_transitions.get(order.status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from '{order.status}' to '{payload.status}'",
        )

    order.status = payload.status
    now = datetime.now(timezone.utc)

    if payload.status == OrderStatus.CONFIRMED:
        order.confirmed_at = now
    elif payload.status == OrderStatus.DELIVERED:
        order.delivered_at = now
        order.payment_status = PaymentStatus.PAID

    db.commit()
    db.refresh(order)
    return order


def cancel_order(db: Session, order_id: int, current_user: User) -> Order:
    return update_order_status(
        db, order_id,
        OrderStatusUpdate(status=OrderStatus.CANCELLED),
        current_user,
    )


def get_order_history(
    db: Session,
    current_user: User,
    page: int = 1,
    size: int = 20,
    status: Optional[OrderStatus] = None,
):
    query = db.query(Order).filter(Order.user_id == current_user.id)
    if status:
        query = query.filter(Order.status == status)
    total = query.count()
    items = query.order_by(Order.placed_at.desc()).offset((page - 1) * size).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": items}


def get_restaurant_orders(
    db: Session,
    restaurant_id: int,
    current_user: User,
    page: int = 1,
    size: int = 20,
    order_status: Optional[OrderStatus] = None,
):
    # Must be restaurant owner or admin
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if restaurant.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")

    query = db.query(Order).filter(Order.restaurant_id == restaurant_id)
    if order_status:
        query = query.filter(Order.status == order_status)
    total = query.count()
    items = query.order_by(Order.placed_at.desc()).offset((page - 1) * size).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": items}
