from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, Enum as SQLAEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class LiveStateEnum(str, enum.Enum):
    idle = "idle"
    engine = "engine"
    maintenance = "maintenance"

class EqLiveStatus(Base):
    __tablename__ = "eqlivestatus"   # no underscore

    statusid = Column(Integer, primary_key=True, index=True)
    eqid = Column(Integer, ForeignKey("equipment.eqid", ondelete="CASCADE"), nullable=False)

    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    livestat = Column(SQLAEnum(LiveStateEnum), nullable=False)

    equipment = relationship("Equipment")
