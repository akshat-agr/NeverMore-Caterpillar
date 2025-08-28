from sqlalchemy import Column, Integer, String
from app.database import Base

class Site(Base):
    __tablename__ = "site"

    site_id = Column(Integer, primary_key=True, index=True)
    site_type = Column(String(255), nullable=False)
    region = Column(String(255), nullable=False)
    site_size = Column(Integer, nullable=True)
