from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.db.session import get_db
from app.models.offer import Offer
from app.models.user import User
from app.schemas.offer import OfferCreate, OfferRead, OfferUpdate

router = APIRouter()


@router.get("", response_model=list[OfferRead])
def list_offers(
    active_only: bool = True,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[Offer]:
    query = db.query(Offer).order_by(Offer.created_at.desc())
    if active_only:
        query = query.filter(Offer.is_active.is_(True))
    return query.limit(limit).all()


@router.post("", response_model=OfferRead, status_code=status.HTTP_201_CREATED)
def create_offer(
    payload: OfferCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Offer:
    offer = Offer(**payload.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


@router.put("/{offer_id}", response_model=OfferRead)
def update_offer(
    offer_id: int,
    payload: OfferUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Offer:
    offer = db.get(Offer, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(offer, key, value)
    db.commit()
    db.refresh(offer)
    return offer


@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> None:
    offer = db.get(Offer, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    offer.is_active = False
    db.commit()

