from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=999)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    customer_phone: str = Field(min_length=6, max_length=30)
    customer_address: str | None = None
    notes: str | None = None
    items: list[OrderItemCreate] = Field(min_length=1)
    source: str = "website"


class OrderItemRead(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_address: str | None
    notes: str | None
    subtotal: Decimal
    discount_total: Decimal
    total: Decimal
    status: OrderStatus
    source: str
    created_at: datetime
    updated_at: datetime
    delivered_at: datetime | None
    items: list[OrderItemRead]

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderConfirmation(BaseModel):
    order: OrderRead
    whatsapp_url: str | None
    whatsapp_message: str

