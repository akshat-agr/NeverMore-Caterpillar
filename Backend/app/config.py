import os
from pathlib import Path
from dotenv import load_dotenv


# Load .env from project root or Backend/.env
root_dir = Path(__file__).resolve().parents[2]
dotenv_candidates = [root_dir / ".env", root_dir / "Backend" / ".env"]
for dotenv_path in dotenv_candidates:
    if dotenv_path.exists():
        load_dotenv(dotenv_path=dotenv_path)
        break


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL") or "sqlite:///./app.db"
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    CLERK_PUBLISHABLE_KEY: str = os.getenv("CLERK_PUBLISHABLE_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS settings
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]


settings = Settings()
