from decimal import Decimal

from pydantic import BaseModel

from app.schemas.order import OrderRead
from app.schemas.product import ProductRead


class DashboardStats(BaseModel):
    total_orders: int
    pending_orders: int
    delivered_orders: int
    total_revenue: Decimal
    active_products: int
    low_stock_products: int
    recent_orders: list[OrderRead]
    low_stock: list[ProductRead]

