from pydantic import BaseModel
from pydantic import ConfigDict

class SiteBase(BaseModel):
    site_type: str
    region: str
    site_size: int | None = None

class SiteCreate(SiteBase):
    pass

class SiteResponse(SiteBase):
    site_id: int

    model_config = ConfigDict(from_attributes=True)
