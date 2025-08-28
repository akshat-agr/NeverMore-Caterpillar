from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum as SQLAEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class LiveStateEnum(str, enum.Enum):
    idle = "idle"
    engine = "engine"
    maintenance = "maintenance"


class EqLiveStatus(Base):
    __tablename__ = "eq_live_status"

    status_id = Column(Integer, primary_key=True, index=True)
    eq_id = Column(Integer, ForeignKey("equipment.eq_id", ondelete="CASCADE"), nullable=False)

    # Current live coordinates
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)

    # Assigned location coordinates
    assigned_latitude = Column(DECIMAL(10, 8), nullable=True)
    assigned_longitude = Column(DECIMAL(11, 8), nullable=True)

    # Machine live status
    live_stat = Column(SQLAEnum(LiveStateEnum), nullable=False)

    # Last logged in datetime (auto set on insert/update)
    last_logged_in = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    equipment = relationship("Equipment")
