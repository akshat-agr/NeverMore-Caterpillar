from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import datetime
from typing import Optional

class RentalBase(BaseModel):
    eq_id: int
    client_id: int
    site_id: int
    checkout: datetime
    checkin: datetime | None = None
    engine_hours_day: float | None = None
    idle_hours_day: float | None = None
    maintenance_hours: float | None = None
    operating_days_month: int | None = None

class RentalCreate(RentalBase):
    pass

class RentalUpdate(BaseModel):
    eq_id: Optional[int] = None
    client_id: Optional[int] = None
    site_id: Optional[int] = None
    checkout: Optional[datetime] = None
    checkin: Optional[datetime] = None
    engine_hours_day: Optional[float] = None
    idle_hours_day: Optional[float] = None
    maintenance_hours: Optional[float] = None
    operating_days_month: Optional[int] = None

class RentalResponse(RentalBase):
    rental_id: int

    model_config = ConfigDict(from_attributes=True)
