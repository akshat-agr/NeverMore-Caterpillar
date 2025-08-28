from pydantic import BaseModel
from pydantic import ConfigDict
from typing import Optional

class SiteBase(BaseModel):
    site_type: str
    region: str
    site_size: int | None = None

class SiteCreate(SiteBase):
    pass

class SiteUpdate(BaseModel):
    site_type: Optional[str] = None
    region: Optional[str] = None
    site_size: Optional[int] = None

class SiteResponse(SiteBase):
    site_id: int

    model_config = ConfigDict(from_attributes=True)
