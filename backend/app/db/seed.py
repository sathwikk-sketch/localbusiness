from decimal import Decimal

from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models import Base
from app.models.category import Category
from app.models.content import Banner, BusinessProfile
from app.models.offer import Offer
from app.models.product import Product
from app.models.user import AdminProfile, User, UserRole


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "owner@example.com").first()
        if not admin:
            admin = User(
                name="Store Owner",
                email="owner@example.com",
                phone="+919876543210",
                role=UserRole.ADMIN,
                hashed_password=get_password_hash("password123"),
            )
            db.add(admin)
            db.flush()
            db.add(
                AdminProfile(
                    user_id=admin.id,
                    business_name="FreshMart Local",
                    business_type="Grocery",
                    whatsapp_number="919876543210",
                )
            )

        profile = db.query(BusinessProfile).first()
        if not profile:
            db.add(
                BusinessProfile(
                    business_name="FreshMart Local",
                    tagline="Groceries, bakery, daily essentials, and quick WhatsApp ordering.",
                    about="FreshMart Local helps nearby families shop faster with fresh stock, visible offers, and simple order pickup.",
                    phone="+91 98765 43210",
                    email="hello@freshmart.local",
                    address="Market Road, Your City",
                    whatsapp_number="919876543210",
                    hero_title="Fresh everyday essentials from your local store",
                    hero_subtitle="Browse popular products, grab limited offers, and send your order straight to WhatsApp.",
                )
            )

        if not db.query(Category).first():
            categories = [
                Category(name="Groceries", slug="groceries", description="Daily staples and household essentials"),
                Category(name="Bakery", slug="bakery", description="Fresh breads, cakes, and snacks"),
                Category(name="Pharmacy", slug="pharmacy", description="Wellness and personal care"),
                Category(name="Fashion", slug="fashion", description="Clothing and seasonal picks"),
            ]
            db.add_all(categories)
            db.flush()
            products = [
                Product(
                    name="Organic Milk 1L",
                    slug="organic-milk-1l",
                    description="Fresh toned milk delivered every morning.",
                    price=Decimal("72"),
                    discount_price=Decimal("65"),
                    category_id=categories[0].id,
                    stock_count=42,
                    is_featured=True,
                    image_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
                ),
                Product(
                    name="Whole Wheat Bread",
                    slug="whole-wheat-bread",
                    description="Soft bakery loaf with whole wheat flour.",
                    price=Decimal("55"),
                    category_id=categories[1].id,
                    stock_count=24,
                    is_featured=True,
                    image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
                ),
                Product(
                    name="Vitamin C Tablets",
                    slug="vitamin-c-tablets",
                    description="Immunity support pack of 30 tablets.",
                    price=Decimal("180"),
                    discount_price=Decimal("149"),
                    category_id=categories[2].id,
                    stock_count=12,
                    image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
                ),
                Product(
                    name="Cotton T-Shirt",
                    slug="cotton-t-shirt",
                    description="Breathable everyday cotton tee.",
                    price=Decimal("499"),
                    discount_price=Decimal("399"),
                    category_id=categories[3].id,
                    stock_count=18,
                    is_featured=True,
                    image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
                ),
            ]
            db.add_all(products)

        if not db.query(Offer).first():
            db.add(
                Offer(
                    title="Weekend Essentials",
                    description="Save more on milk, bread, snacks, and household staples.",
                    percentage=Decimal("12"),
                    highlight_text="This weekend only",
                    is_active=True,
                )
            )

        if not db.query(Banner).first():
            db.add(
                Banner(
                    title="Festival combos are live",
                    subtitle="Curated grocery, bakery, and gifting bundles for nearby customers.",
                    image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
                    cta_label="Shop offers",
                    cta_href="#offers",
                    sort_order=1,
                )
            )

        db.commit()
        print("Seed data ready. Admin login: owner@example.com / password123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

