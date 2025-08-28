from sqlalchemy.orm import Session
from app.models import equipment
from app.schemas import equipment as equipment_schema

def create_equipment(db: Session, equipment_in: equipment_schema.EquipmentCreate):
    db_item = equipment.Equipment(**equipment_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_equipment(db: Session, eq_id: int):
    return db.query(equipment.Equipment).filter(equipment.Equipment.eq_id == eq_id).first()

def get_all_equipment(db: Session):
    return db.query(equipment.Equipment).all()
