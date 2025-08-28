from pydantic import BaseModel
from pydantic import ConfigDict
from decimal import Decimal
from app.models.eqlivestatus import LiveStateEnum
from typing import Optional


class EqLiveStatusBase(BaseModel):
    eq_id: int
    latitude: Decimal
    longitude: Decimal
    live_stat: LiveStateEnum


class EqLiveStatusCreate(EqLiveStatusBase):
    pass


class EqLiveStatusResponse(EqLiveStatusBase):
    status_id: int

    model_config = ConfigDict(from_attributes=True)


class EqLiveStatusUpdate(BaseModel):
    eq_id: Optional[int] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    live_stat: Optional[LiveStateEnum] = None
