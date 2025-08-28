from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import equipment as crud
from app.schemas import equipment as schemas

router = APIRouter(prefix="/equipment", tags=["Equipment"])

@router.post("/", response_model=schemas.EquipmentResponse)
def create_equipment(item: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    return crud.create_equipment(db, item)

@router.get("/{eq_id}", response_model=schemas.EquipmentResponse | None)
def read_equipment(eq_id: int, db: Session = Depends(get_db)):
    return crud.get_equipment(db, eq_id)

@router.get("/", response_model=list[schemas.EquipmentResponse])
def read_all_equipment(db: Session = Depends(get_db)):
    return crud.get_all_equipment(db)

