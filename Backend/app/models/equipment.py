from sqlalchemy import Column, Integer, String, Date, Text
from app.database import Base

class Equipment(Base):
    __tablename__ = "equipment"

    eq_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(255), nullable=False)
    manufactured_date = Column(Date, nullable=False)
    last_maintenance_date = Column(Date, nullable=True)
    condition = Column(Text, nullable=True)
