from sqlalchemy import Column, Integer, ForeignKey, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from app.database import Base

class Rental(Base):
    __tablename__ = "rental"

    rental_id = Column(Integer, primary_key=True, index=True)

    eq_id = Column(Integer, ForeignKey("equipment.eq_id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, nullable=False)
    site_id = Column(Integer, ForeignKey("site.site_id", ondelete="CASCADE"), nullable=False)

    checkout = Column(DateTime, nullable=False)
    checkin = Column(DateTime, nullable=True)

    engine_hours_day = Column(DECIMAL(10, 2), nullable=True)
    idle_hours_day = Column(DECIMAL(10, 2), nullable=True)
    maintenance_hours = Column(DECIMAL(10, 2), nullable=True)
    operating_days_month = Column(Integer, nullable=True)

    # relationships
    equipment = relationship("Equipment")
    site = relationship("Site")
