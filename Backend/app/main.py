from fastapi import FastAPI
from app.database import Base, engine
from app.routers import equipment, site, rental, eqlivestatus

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Rental System")

# Register routers
app.include_router(equipment.router)
app.include_router(site.router)
app.include_router(rental.router)
app.include_router(eq_live_status.router)
