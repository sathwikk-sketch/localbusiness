from functools import cached_property
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    APP_NAME: str = "LocalBiz Commerce API"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = Field(default="change-this-secret-before-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5433/localbiz"
    DB_HOST: str | None = None
    DB_PORT: int | None = None
    DB_NAME: str | None = None
    DB_USER: str | None = None
    DB_PASSWORD: str | None = None
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    UPLOAD_DIR: str = "static/uploads"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @cached_property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    @cached_property
    def sqlalchemy_database_url(self) -> str | URL:
        if not self.DB_PASSWORD:
            return self.DATABASE_URL

        return URL.create(
            "postgresql+psycopg2",
            username=self.DB_USER or "postgres",
            password=self.DB_PASSWORD,
            host=self.DB_HOST or "localhost",
            port=self.DB_PORT or 5433,
            database=self.DB_NAME or "localbiz",
        )

    @cached_property
    def static_path(self) -> Path:
        path = BACKEND_DIR / "static"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @cached_property
    def upload_path(self) -> Path:
        path = BACKEND_DIR / self.UPLOAD_DIR
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()
