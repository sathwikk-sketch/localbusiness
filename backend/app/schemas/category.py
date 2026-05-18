from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None


class CategoryRead(CategoryBase):
    id: int
    slug: str

    model_config = {"from_attributes": True}

