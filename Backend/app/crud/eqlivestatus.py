from sqlalchemy.orm import Session
from app.models import eqlivestatus
from app.schemas import eqlivestatus as eqlivestatus_schema


def create_status(db: Session, status: eqlivestatus_schema.EqLiveStatusCreate):
    db_status = eqlivestatus.EqLiveStatus(**status.model_dump())
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status


def get_status(db: Session, status_id: int):
    return db.query(eqlivestatus.EqLiveStatus).filter(eqlivestatus.EqLiveStatus.status_id == status_id).first()


def get_all_statuses(db: Session):
    return db.query(eqlivestatus.EqLiveStatus).all()

def update_status(db: Session, status_id: int, status_in: eqlivestatus_schema.EqLiveStatusUpdate):
    db_item = get_status(db, status_id)
    if not db_item:
        return None
    data = status_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_status(db: Session, status_id: int) -> bool:
    db_item = get_status(db, status_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
