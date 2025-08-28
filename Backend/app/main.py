from fastapi import FastAPI
from app.database import Base, engine
# Ensure models are imported before metadata.create_all so tables are created
from app.models import equipment as _m_equipment  # noqa: F401
from app.models import site as _m_site  # noqa: F401
from app.models import rental as _m_rental  # noqa: F401
from app.models import eqlivestatus as _m_eqlivestatus  # noqa: F401
from app.routers import equipment, site, rental, eqlivestatus

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Rental System")

# Register routers
app.include_router(equipment.router)
app.include_router(site.router)
app.include_router(rental.router)
app.include_router(eqlivestatus.router)
