from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import date

class EquipmentBase(BaseModel):
    type: str
    manufactured_date: date
    last_maintenance_date: date | None = None
    condition: str | None = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentResponse(EquipmentBase):
    eq_id: int

    model_config = ConfigDict(from_attributes=True)
