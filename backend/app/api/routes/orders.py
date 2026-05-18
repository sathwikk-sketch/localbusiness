from datetime import datetime, timezone
from decimal import Decimal
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_admin
from app.db.session import get_db
from app.models.content import BusinessProfile
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderConfirmation, OrderCreate, OrderRead, OrderStatusUpdate

router = APIRouter()


def make_order_number() -> str:
    return f"LB{datetime.now(timezone.utc).strftime('%y%m%d%H%M%S%f')[:-3]}"


def normalize_whatsapp_number(number: str | None) -> str | None:
    if not number:
        return None
    cleaned = "".join(ch for ch in number if ch.isdigit())
    return cleaned or None


def build_whatsapp_message(order: Order) -> str:
    lines = ["Hello, I want to order:", ""]
    lines.extend(f"* {item.quantity} {item.product_name}" for item in order.items)
    lines.append(f"Total: ₹{order.total}")
    lines.append(f"Order ID: {order.order_number}")
    if order.customer_name:
        lines.append(f"Name: {order.customer_name}")
    if order.customer_phone:
        lines.append(f"Phone: {order.customer_phone}")
    if order.customer_address:
        lines.append(f"Address: {order.customer_address}")
    return "\n".join(lines)


def build_whatsapp_url(db: Session, order: Order) -> tuple[str | None, str]:
    profile = db.query(BusinessProfile).order_by(BusinessProfile.id.asc()).first()
    message = build_whatsapp_message(order)
    number = normalize_whatsapp_number(profile.whatsapp_number if profile else None)
    if not number:
        return None, message
    return f"https://wa.me/{number}?text={quote(message)}", message


@router.post("", response_model=OrderConfirmation, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> OrderConfirmation:
    order = Order(
        order_number=make_order_number(),
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        customer_address=payload.customer_address,
        notes=payload.notes,
        source=payload.source,
    )

    subtotal = Decimal("0")
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock_count < item.quantity:
            raise HTTPException(status_code=400, detail=f"{product.name} has only {product.stock_count} in stock")

        unit_price = product.discount_price or product.price
        line_total = unit_price * item.quantity
        subtotal += line_total
        product.stock_count -= item.quantity
        order.items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                unit_price=unit_price,
                quantity=item.quantity,
                line_total=line_total,
            )
        )

    order.subtotal = subtotal
    order.discount_total = Decimal("0")
    order.total = subtotal
    db.add(order)
    db.commit()
    db.refresh(order)
    whatsapp_url, whatsapp_message = build_whatsapp_url(db, order)
    return OrderConfirmation(order=order, whatsapp_url=whatsapp_url, whatsapp_message=whatsapp_message)


@router.get("", response_model=list[OrderRead])
def list_orders(
    status_filter: OrderStatus | None = Query(default=None, alias="status"),
    search: str | None = None,
    limit: int = Query(100, ge=1, le=300),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[Order]:
    query = db.query(Order).options(joinedload(Order.items)).order_by(Order.created_at.desc())
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Order.order_number.ilike(term),
                Order.customer_name.ilike(term),
                Order.customer_phone.ilike(term),
            )
        )
    return query.limit(limit).all()


@router.get("/track/{order_number}", response_model=OrderRead)
def track_order(order_number: str, db: Session = Depends(get_db)) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.order_number == order_number.upper())
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Order:
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    order.delivered_at = datetime.now(timezone.utc) if payload.status == OrderStatus.DELIVERED else None
    db.commit()
    db.refresh(order)
    return order

