import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="Backend/.env")

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL") or ""

settings = Settings()
