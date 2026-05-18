from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class OfferBase(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    description: str | None = None
    percentage: Decimal = Field(default=0, ge=0, le=95)
    banner_image_url: str | None = None
    highlight_text: str | None = None
    product_id: int | None = None
    category_id: int | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool = True


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=180)
    description: str | None = None
    percentage: Decimal | None = Field(default=None, ge=0, le=95)
    banner_image_url: str | None = None
    highlight_text: str | None = None
    product_id: int | None = None
    category_id: int | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_active: bool | None = None


class OfferRead(OfferBase):
    id: int

    model_config = {"from_attributes": True}

