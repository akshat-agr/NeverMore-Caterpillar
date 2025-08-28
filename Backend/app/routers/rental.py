from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.crud import rental as crud
from app.schemas import rental as schemas

router = APIRouter(prefix="/rentals", tags=["Rentals"])

@router.post("/", response_model=schemas.RentalResponse)
def create_rental(rental: schemas.RentalCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_rental(db, rental)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Rental with this rental_id already exists or FK constraint failed")

@router.get("/{rental_id}", response_model=schemas.RentalResponse)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    item = crud.get_rental(db, rental_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rental not found")
    return item

@router.get("/", response_model=list[schemas.RentalResponse])
def read_all_rentals(db: Session = Depends(get_db)):
    return crud.get_all_rentals(db)

@router.put("/{rental_id}", response_model=schemas.RentalResponse)
def update_rental(rental_id: int, rental_in: schemas.RentalUpdate, db: Session = Depends(get_db)):
    updated = crud.update_rental(db, rental_id, rental_in)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rental not found")
    return updated

@router.delete("/{rental_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rental(rental_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_rental(db, rental_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rental not found")
    return None
