from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

class Setting(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRY: int
    REFRESH_TOKEN_EXPIRY: int
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: int
    CLOUDINARY_API_SECRET: str
    model_config = SettingsConfigDict(env_file=ENV_FILE)


@lru_cache
def settings():
    return Setting()