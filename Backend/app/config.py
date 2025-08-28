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


settings = Settings()
