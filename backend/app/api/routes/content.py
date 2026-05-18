from pathlib import Path
from shutil import copyfileobj
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import require_admin
from app.db.session import get_db
from app.models.content import Banner, BusinessProfile
from app.models.user import User
from app.schemas.content import (
    BannerCreate,
    BannerRead,
    BannerUpdate,
    BusinessProfileRead,
    BusinessProfileUpdate,
    UploadResponse,
)

router = APIRouter()


def get_or_create_profile(db: Session) -> BusinessProfile:
    profile = db.query(BusinessProfile).order_by(BusinessProfile.id.asc()).first()
    if profile:
        return profile
    profile = BusinessProfile()
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile", response_model=BusinessProfileRead)
def read_profile(db: Session = Depends(get_db)) -> BusinessProfile:
    return get_or_create_profile(db)


@router.put("/profile", response_model=BusinessProfileRead)
def update_profile(
    payload: BusinessProfileUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> BusinessProfile:
    profile = get_or_create_profile(db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/banners", response_model=list[BannerRead])
def list_banners(active_only: bool = True, db: Session = Depends(get_db)) -> list[Banner]:
    query = db.query(Banner).order_by(Banner.sort_order.asc(), Banner.created_at.desc())
    if active_only:
        query = query.filter(Banner.is_active.is_(True))
    return query.all()


@router.post("/banners", response_model=BannerRead, status_code=status.HTTP_201_CREATED)
def create_banner(
    payload: BannerCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Banner:
    banner = Banner(**payload.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner


@router.put("/banners/{banner_id}", response_model=BannerRead)
def update_banner(
    banner_id: int,
    payload: BannerUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Banner:
    banner = db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
    db.commit()
    db.refresh(banner)
    return banner


@router.delete("/banners/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_banner(
    banner_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    banner = db.get(Banner, banner_id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    banner.is_active = False
    db.commit()


@router.post("/uploads", response_model=UploadResponse)
def upload_image(
    file: UploadFile = File(...),
    _: User = Depends(require_admin),
) -> UploadResponse:
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")

    suffix = Path(file.filename or "").suffix.lower() or ".jpg"
    filename = f"{uuid4().hex}{suffix}"
    destination = settings.upload_path / filename
    with destination.open("wb") as buffer:
        copyfileobj(file.file, buffer)
    return UploadResponse(url=f"/static/uploads/{filename}")

