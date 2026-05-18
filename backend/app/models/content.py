from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    business_name: Mapped[str] = mapped_column(String(160), default="FreshCart Local")
    tagline: Mapped[str] = mapped_column(String(220), default="Fresh products, quick ordering, easy pickup.")
    about: Mapped[str] = mapped_column(
        Text,
        default="A neighborhood business serving customers with dependable products, fair prices, and friendly service.",
    )
    logo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    whatsapp_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    maps_embed_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_title: Mapped[str] = mapped_column(String(220), default="Your neighborhood store, now online")
    hero_subtitle: Mapped[str] = mapped_column(
        Text,
        default="Browse products, discover offers, and place orders in seconds through the website or WhatsApp.",
    )
    currency: Mapped[str] = mapped_column(String(8), default="INR")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Banner(Base):
    __tablename__ = "banners"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(180))
    subtitle: Mapped[str | None] = mapped_column(String(240), nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_href: Mapped[str | None] = mapped_column(String(200), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
