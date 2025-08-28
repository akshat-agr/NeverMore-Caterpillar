from pydantic import BaseModel

class SiteBase(BaseModel):
    site_type: str
    region: str
    site_size: int | None = None

class SiteCreate(SiteBase):
    pass

class SiteResponse(SiteBase):
    site_id: int

    class Config:
        orm_mode = True
