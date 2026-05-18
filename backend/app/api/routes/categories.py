from fastapi import APIRouter, Depends, HTTPException, status
from slugify import slugify
from sqlalchemy.orm import Session

from app.core.deps import get_optional_user, require_admin
from app.db.session import get_db
from app.models.category import Category
from app.models.user import User, UserRole
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter()


def unique_slug(db: Session, name: str, current_id: int | None = None) -> str:
    base = slugify(name) or "category"
    slug = base
    counter = 2
    while True:
        query = db.query(Category).filter(Category.slug == slug)
        if current_id:
            query = query.filter(Category.id != current_id)
        if not query.first():
            return slug
        slug = f"{base}-{counter}"
        counter += 1


@router.get("", response_model=list[CategoryRead])
def list_categories(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> list[Category]:
    if include_inactive and (not current_user or current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Admin access required")
    query = db.query(Category).order_by(Category.name.asc())
    if not include_inactive:
        query = query.filter(Category.is_active.is_(True))
    return query.all()


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Category:
    category = Category(**payload.model_dump(), slug=unique_slug(db, payload.name))
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Category:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        category.slug = unique_slug(db, data["name"], category_id)
    for key, value in data.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.is_active = False
    db.commit()
