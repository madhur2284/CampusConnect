from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pathlib import Path
import ssl
from typing import Any

from sqlalchemy.engine import URL, make_url

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

class Setting(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRY: int
    REFRESH_TOKEN_EXPIRY: int
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: int
    CLOUDINARY_API_SECRET: str
    CORS_ORIGINS: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=ENV_FILE)


@lru_cache
def settings():
    return Setting()


def database_connection_options() -> tuple[URL, dict[str, Any]]:
    """Build an asyncpg URL and connection options from the configured URL."""
    database_url = make_url(settings().DATABASE_URL)
    query = dict(database_url.query)
    sslmode = query.pop("sslmode", None)
    for parameter in ("channel_binding", "sslrootcert", "sslcert", "sslkey"):
        query.pop(parameter, None)

    if database_url.drivername in {"postgres", "postgresql"}:
        database_url = database_url.set(drivername="postgresql+asyncpg")

    database_url = database_url.set(query=query)
    connect_args: dict[str, Any] = {
        "ssl": False if sslmode == "disable" else ssl.create_default_context()
    }
    return database_url, connect_args