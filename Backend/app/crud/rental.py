from sqlalchemy.orm import Session
from app.models import rental
from app.schemas import rental as rental_schema

def create_rental(db: Session, rental_in: rental_schema.RentalCreate):
    db_rental = rental.Rental(**rental_in.dict())
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental

def get_rental(db: Session, rental_id: int):
    return db.query(rental.Rental).filter(rental.Rental.rental_id == rental_id).first()

def get_all_rentals(db: Session):
    return db.query(rental.Rental).all()
