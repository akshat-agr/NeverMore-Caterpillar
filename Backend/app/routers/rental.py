from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import rental as crud
from app.schemas import rental as schemas

router = APIRouter(prefix="/rentals", tags=["Rentals"])

@router.post("/", response_model=schemas.RentalResponse)
def create_rental(rental: schemas.RentalCreate, db: Session = Depends(get_db)):
    return crud.create_rental(db, rental)

@router.get("/{rental_id}", response_model=schemas.RentalResponse | None)
def read_rental(rental_id: int, db: Session = Depends(get_db)):
    return crud.get_rental(db, rental_id)

@router.get("/", response_model=list[schemas.RentalResponse])
def read_all_rentals(db: Session = Depends(get_db)):
    return crud.get_all_rentals(db)
