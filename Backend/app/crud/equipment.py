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

def update_equipment(db: Session, eq_id: int, equipment_in: equipment_schema.EquipmentUpdate):
    db_item = get_equipment(db, eq_id)
    if not db_item:
        return None
    data = equipment_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_equipment(db: Session, eq_id: int) -> bool:
    db_item = get_equipment(db, eq_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
