from pydantic import BaseModel
from pydantic import ConfigDict
from datetime import date
from typing import Optional

class EquipmentBase(BaseModel):
    type: str
    manufactured_date: date
    last_maintenance_date: date | None = None
    condition: str | None = None

class EquipmentCreate(EquipmentBase):
    eq_id: int

class EquipmentUpdate(BaseModel):
    type: Optional[str] = None
    manufactured_date: Optional[date] = None
    last_maintenance_date: Optional[date] = None
    condition: Optional[str] = None

class EquipmentResponse(EquipmentBase):
    eq_id: int

    model_config = ConfigDict(from_attributes=True)
