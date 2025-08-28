from sqlalchemy.orm import Session
from app.models import eqlivestatus
from app.schemas import eqlivestatus as eqlivestatus_schema

def create_status(db: Session, status: eqlivestatus_schema.EqLiveStatusCreate):
    db_status = eqlivestatus.EqLiveStatus(**status.dict())
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

def get_status(db: Session, status_id: int):
    return db.query(eqlivestatus.EqLiveStatus).filter(eqlivestatus.EqLiveStatus.status_id == status_id).first()

def get_all_statuses(db: Session):
    return db.query(eqlivestatus.EqLiveStatus).all()
