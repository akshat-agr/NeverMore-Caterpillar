from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum as SQLAEnum
from sqlalchemy.orm import relationship
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

    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    live_stat = Column(SQLAEnum(LiveStateEnum), nullable=False)

    equipment = relationship("Equipment")
