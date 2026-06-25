import os
from typing import List, Union
from pydantic import AnyHttpUrl, before_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated

def parse_cors_origins(v: Union[str, List[str]]) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    PROJECT_NAME: str = "PlasticVision AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretjwtkeyforplasticvisionai2026!!!"  # In prod, load from env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Default to local SQLite database so it runs out-of-the-box
    DATABASE_URL: str = "sqlite:///./plasticvision.db"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: Annotated[
        List[str], before_validator(parse_cors_origins)
    ] = ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]

    # Initial Admin Seed
    FIRST_SUPERUSER_EMAIL: str = "admin@plasticvision.ai"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
