from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Business Architect"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "ai_business_architect_secret_key_2026_xyz" # Default key for testing, override via .env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./dev.db"

    # API Keys
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None

    model_config = ConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
