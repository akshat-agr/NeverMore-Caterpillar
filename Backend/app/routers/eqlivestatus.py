from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import eqlivestatus as crud
from app.schemas import eqlivestatus as schemas

router = APIRouter(prefix="/status", tags=["Equipment Live Status"])

@router.post("/", response_model=schemas.EqLiveStatusResponse)
def create_status(status: schemas.EqLiveStatusCreate, db: Session = Depends(get_db)):
    return crud.create_status(db, status)

@router.get("/{status_id}", response_model=schemas.EqLiveStatusResponse | None)
def read_status(status_id: int, db: Session = Depends(get_db)):
    return crud.get_status(db, status_id)

@router.get("/", response_model=list[schemas.EqLiveStatusResponse])
def read_all_statuses(db: Session = Depends(get_db)):
    return crud.get_all_statuses(db)
