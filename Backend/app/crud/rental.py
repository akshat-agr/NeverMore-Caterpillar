from sqlalchemy.orm import Session
from app.models import rental
from app.schemas import rental as rental_schema

def create_rental(db: Session, rental_in: rental_schema.RentalCreate):
    db_rental = rental.Rental(**rental_in.model_dump())
    db.add(db_rental)
    db.commit()
    db.refresh(db_rental)
    return db_rental

def get_rental(db: Session, rental_id: int):
    return db.query(rental.Rental).filter(rental.Rental.rental_id == rental_id).first()

def get_all_rentals(db: Session):
    return db.query(rental.Rental).all()

def update_rental(db: Session, rental_id: int, rental_in: rental_schema.RentalUpdate):
    db_item = get_rental(db, rental_id)
    if not db_item:
        return None
    data = rental_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_rental(db: Session, rental_id: int) -> bool:
    db_item = get_rental(db, rental_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
