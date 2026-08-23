from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Setting(BaseSettings):
    DATABASE_URL: str
    model_config = SettingsConfigDict(env_file='.env')


@lru_cache
def settings():
    return Setting()