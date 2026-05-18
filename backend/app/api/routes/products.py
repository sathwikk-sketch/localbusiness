from fastapi import APIRouter, Depends, HTTPException, Query, status
from slugify import slugify
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_optional_user, require_admin
from app.db.session import get_db
from app.models.product import Product
from app.models.user import User, UserRole
from app.schemas.product import ProductCreate, ProductRead, ProductStockUpdate, ProductUpdate

router = APIRouter()


def unique_slug(db: Session, name: str, current_id: int | None = None) -> str:
    base = slugify(name) or "product"
    slug = base
    counter = 2
    while True:
        query = db.query(Product).filter(Product.slug == slug)
        if current_id:
            query = query.filter(Product.id != current_id)
        if not query.first():
            return slug
        slug = f"{base}-{counter}"
        counter += 1


@router.get("", response_model=list[ProductRead])
def list_products(
    search: str | None = None,
    category_id: int | None = None,
    featured: bool | None = None,
    in_stock: bool | None = None,
    include_inactive: bool = False,
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> list[Product]:
    if include_inactive and (not current_user or current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Admin access required")
    query = db.query(Product).options(joinedload(Product.category)).order_by(Product.created_at.desc())
    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))
    if search:
        term = f"%{search}%"
        query = query.filter(or_(Product.name.ilike(term), Product.description.ilike(term)))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if in_stock is True:
        query = query.filter(Product.stock_count > 0)
    if in_stock is False:
        query = query.filter(Product.stock_count <= 0)
    return query.limit(limit).all()


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Product:
    product = Product(**payload.model_dump(), slug=unique_slug(db, payload.name))
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        product.slug = unique_slug(db, data["name"], product_id)
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}/stock", response_model=ProductRead)
def update_stock(
    product_id: int,
    payload: ProductStockUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.stock_count = payload.stock_count
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()
