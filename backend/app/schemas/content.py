from pydantic import BaseModel, EmailStr, Field


class BusinessProfileBase(BaseModel):
    business_name: str = Field(min_length=2, max_length=160)
    tagline: str = Field(max_length=220)
    about: str
    logo_url: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    whatsapp_number: str | None = None
    maps_embed_url: str | None = None
    hero_title: str = Field(min_length=2, max_length=220)
    hero_subtitle: str
    currency: str = "INR"


class BusinessProfileUpdate(BaseModel):
    business_name: str | None = Field(default=None, min_length=2, max_length=160)
    tagline: str | None = Field(default=None, max_length=220)
    about: str | None = None
    logo_url: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    whatsapp_number: str | None = None
    maps_embed_url: str | None = None
    hero_title: str | None = Field(default=None, min_length=2, max_length=220)
    hero_subtitle: str | None = None
    currency: str | None = None


class BusinessProfileRead(BusinessProfileBase):
    id: int

    model_config = {"from_attributes": True}


class BannerBase(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    subtitle: str | None = None
    image_url: str | None = None
    cta_label: str | None = None
    cta_href: str | None = None
    sort_order: int = 0
    is_active: bool = True


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=180)
    subtitle: str | None = None
    image_url: str | None = None
    cta_label: str | None = None
    cta_href: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class BannerRead(BannerBase):
    id: int

    model_config = {"from_attributes": True}


class UploadResponse(BaseModel):
    url: str

