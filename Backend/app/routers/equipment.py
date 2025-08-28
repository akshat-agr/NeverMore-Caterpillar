from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.crud import equipment as crud
from app.schemas import equipment as schemas

router = APIRouter(prefix="/equipment", tags=["Equipment"])

@router.post("/", response_model=schemas.EquipmentResponse)
def create_equipment(item: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_equipment(db, item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Equipment with this eq_id already exists")

@router.get("/{eq_id}", response_model=schemas.EquipmentResponse | None)
def read_equipment(eq_id: int, db: Session = Depends(get_db)):
    item = crud.get_equipment(db, eq_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return item

@router.get("/", response_model=list[schemas.EquipmentResponse])
def read_all_equipment(db: Session = Depends(get_db)):
    return crud.get_all_equipment(db)

@router.put("/{eq_id}", response_model=schemas.EquipmentResponse)
def update_equipment(eq_id: int, item: schemas.EquipmentUpdate, db: Session = Depends(get_db)):
    updated = crud.update_equipment(db, eq_id, item)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return updated

@router.delete("/{eq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(eq_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_equipment(db, eq_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return None

