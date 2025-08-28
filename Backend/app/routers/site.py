from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import site as crud
from app.schemas import site as schemas

router = APIRouter(prefix="/sites", tags=["Sites"])

@router.post("/", response_model=schemas.SiteResponse)
def create_site(site: schemas.SiteCreate, db: Session = Depends(get_db)):
    return crud.create_site(db, site)

@router.get("/{site_id}", response_model=schemas.SiteResponse | None)
def read_site(site_id: int, db: Session = Depends(get_db)):
    return crud.get_site(db, site_id)

@router.get("/", response_model=list[schemas.SiteResponse])
def read_all_sites(db: Session = Depends(get_db)):
    return crud.get_all_sites(db)
