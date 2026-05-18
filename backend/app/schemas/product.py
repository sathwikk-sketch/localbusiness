from decimal import Decimal

from pydantic import BaseModel, Field, model_validator

from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    description: str | None = None
    price: Decimal = Field(gt=0)
    discount_price: Decimal | None = Field(default=None, gt=0)
    category_id: int | None = None
    stock_count: int = Field(ge=0)
    image_url: str | None = None
    is_featured: bool = False
    is_active: bool = True

    @model_validator(mode="after")
    def validate_discount(self) -> "ProductBase":
        if self.discount_price is not None and self.discount_price >= self.price:
            raise ValueError("Discount price must be lower than price")
        return self


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    discount_price: Decimal | None = Field(default=None, gt=0)
    category_id: int | None = None
    stock_count: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None


class ProductStockUpdate(BaseModel):
    stock_count: int = Field(ge=0)


class ProductRead(ProductBase):
    id: int
    slug: str
    in_stock: bool
    category: CategoryRead | None = None

    model_config = {"from_attributes": True}

