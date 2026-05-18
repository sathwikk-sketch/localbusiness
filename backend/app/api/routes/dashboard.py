from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_admin
from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.dashboard import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db), _: User = Depends(require_admin)) -> DashboardStats:
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.PENDING).scalar() or 0
    delivered_orders = db.query(func.count(Order.id)).filter(Order.status == OrderStatus.DELIVERED).scalar() or 0
    revenue = (
        db.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.status == OrderStatus.DELIVERED)
        .scalar()
        or Decimal("0")
    )
    active_products = db.query(func.count(Product.id)).filter(Product.is_active.is_(True)).scalar() or 0
    low_stock_products = (
        db.query(func.count(Product.id))
        .filter(Product.is_active.is_(True), Product.stock_count <= 5)
        .scalar()
        or 0
    )
    recent_orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .order_by(Order.created_at.desc())
        .limit(8)
        .all()
    )
    low_stock = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.is_active.is_(True), Product.stock_count <= 5)
        .order_by(Product.stock_count.asc())
        .limit(8)
        .all()
    )
    return DashboardStats(
        total_orders=total_orders,
        pending_orders=pending_orders,
        delivered_orders=delivered_orders,
        total_revenue=revenue,
        active_products=active_products,
        low_stock_products=low_stock_products,
        recent_orders=recent_orders,
        low_stock=low_stock,
    )
