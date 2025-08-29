from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.database import Base, engine
from app.models import equipment as _m_equipment  # noqa: F401
from app.models import site as _m_site  # noqa: F401
from app.models import rental as _m_rental  # noqa: F401
from app.models import eqlivestatus as _m_eqlivestatus  # noqa: F401
from app.routers import equipment, site, rental, eqlivestatus

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Optional: seed database
try:
    from app.seed_data import seed_database
    seed_database()
except Exception as e:
    logger.warning(f"Could not seed database: {e}")

# Initialize FastAPI
app = FastAPI(
    title="Smart Rental System",
    description="API for managing construction equipment rental and tracking",
    version="1.0.0"
)

# CORS middleware - allow your frontend on LAN
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default root route
@app.get("/")
def root():
    return {"message": "Welcome to the Smart Rental System API 🚜"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

# Register routers
app.include_router(equipment.router, prefix="/api/v1")
app.include_router(site.router, prefix="/api/v1")
app.include_router(rental.router, prefix="/api/v1")
app.include_router(eqlivestatus.router, prefix="/api/v1")
