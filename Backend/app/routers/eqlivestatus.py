from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.crud import eqlivestatus as crud
from app.schemas import eqlivestatus as schemas

router = APIRouter(prefix="/status", tags=["Equipment Live Status"])

@router.post("/", response_model=schemas.EqLiveStatusResponse)
def create_status(status: schemas.EqLiveStatusCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_status(db, status)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Status with this status_id already exists or FK constraint failed")

@router.get("/{status_id}", response_model=schemas.EqLiveStatusResponse)
def read_status(status_id: int, db: Session = Depends(get_db)):
    item = crud.get_status(db, status_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
        
    return item

@router.get("/", response_model=list[schemas.EqLiveStatusResponse])
def read_all_statuses(db: Session = Depends(get_db)):
    return crud.get_all_statuses(db)

@router.put("/{status_id}", response_model=schemas.EqLiveStatusResponse)
def update_status(status_id: int, status_in: schemas.EqLiveStatusUpdate, db: Session = Depends(get_db)):
    updated = crud.update_status(db, status_id, status_in)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return updated

@router.delete("/{status_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_status(status_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_status(db, status_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status not found")
    return None
