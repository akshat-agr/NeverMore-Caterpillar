from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.crud import site as crud
from app.schemas import site as schemas

router = APIRouter(prefix="/sites", tags=["Sites"])

@router.post("/", response_model=schemas.SiteResponse)
def create_site(site: schemas.SiteCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_site(db, site)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Site with this site_id already exists")

@router.get("/{site_id}", response_model=schemas.SiteResponse)
def read_site(site_id: int, db: Session = Depends(get_db)):
    item = crud.get_site(db, site_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    return item

@router.get("/", response_model=list[schemas.SiteResponse])
def read_all_sites(db: Session = Depends(get_db)):
    return crud.get_all_sites(db)

@router.put("/{site_id}", response_model=schemas.SiteResponse)
def update_site(site_id: int, site_in: schemas.SiteUpdate, db: Session = Depends(get_db)):
    updated = crud.update_site(db, site_id, site_in)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    return updated

@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_site(db, site_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")
    return None
