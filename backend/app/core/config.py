from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Setting(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRY: int
    REFRESH_TOKEN_EXPIRY: int
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: int
    CLOUDINARY_API_SECRET: str
    model_config = SettingsConfigDict(env_file='.env')


@lru_cache
def settings():
    return Setting()