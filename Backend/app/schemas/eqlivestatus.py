from pydantic import BaseModel
from decimal import Decimal
from app.models.eqlivestatus import LiveStateEnum

class EqLiveStatusBase(BaseModel):
    eqid: int
    latitude: Decimal
    longitude: Decimal
    livestat: LiveStateEnum

class EqLiveStatusCreate(EqLiveStatusBase):
    pass

class EqLiveStatusResponse(EqLiveStatusBase):
    statusid: int

    class Config:
        orm_mode = True
