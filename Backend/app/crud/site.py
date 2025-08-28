from sqlalchemy.orm import Session
from app.models import site
from app.schemas import site as site_schema


def create_site(db: Session, site_in: site_schema.SiteCreate):
    db_item = site.Site(**site_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_site(db: Session, site_id: int):
    return db.query(site.Site).filter(site.Site.site_id == site_id).first()


def get_all_sites(db: Session):
    return db.query(site.Site).all()

def update_site(db: Session, site_id: int, site_in: site_schema.SiteUpdate):
    db_item = get_site(db, site_id)
    if not db_item:
        return None
    data = site_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_site(db: Session, site_id: int) -> bool:
    db_item = get_site(db, site_id)
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
