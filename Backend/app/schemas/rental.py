from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import datetime

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

class RentalResponse(RentalBase):
    rental_id: int

    model_config = ConfigDict(from_attributes=True)
