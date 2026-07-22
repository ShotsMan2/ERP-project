from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "ERP Platform"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Enterprise Resource Planning Platform"
    DEBUG: bool = False
    ENVIRONMENT: Literal["local", "dev", "staging", "production"] = "local"
    API_V1_PREFIX: str = "/api/v1"
    API_V2_PREFIX: str = "/api/v2"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_NAME: str = "erp_platform"
    DB_MIN_POOL_SIZE: int = 5
    DB_MAX_POOL_SIZE: int = 20
    DB_ECHO: bool = False
    DB_SCHEMA: str = "public"

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def database_url_sync(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    REDIS_SSL: bool = False

    @property
    def redis_url(self) -> str:
        prefix = "rediss" if self.REDIS_SSL else "redis"
        if self.REDIS_PASSWORD:
            return f"{prefix}://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"{prefix}://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # JWT
    JWT_PRIVATE_KEY: str = ""
    JWT_PUBLIC_KEY: str = ""
    JWT_ALGORITHM: str = "RS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ISSUER: str = "erp-platform"

    # S3 / Object Storage
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_REGION: str = "us-east-1"
    S3_BUCKET: str = "erp-platform"
    S3_USE_SSL: bool = False

    # Email (SMTP)
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_FROM_EMAIL: str = "noreply@erp-platform.com"
    SMTP_FROM_NAME: str = "ERP Platform"

    # RabbitMQ / Celery
    RABBITMQ_HOST: str = "localhost"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "guest"
    RABBITMQ_PASSWORD: str = "guest"
    RABBITMQ_VHOST: str = "/"

    @property
    def celery_broker_url(self) -> str:
        return f"amqp://{self.RABBITMQ_USER}:{self.RABBITMQ_PASSWORD}@{self.RABBITMQ_HOST}:{self.RABBITMQ_PORT}/{self.RABBITMQ_VHOST}"

    @property
    def celery_result_backend(self) -> str:
        return self.redis_url

    # Elasticsearch
    ES_HOST: str = "http://localhost:9200"
    ES_USER: str | None = None
    ES_PASSWORD: str | None = None
    ES_VERIFY_CERTS: bool = True
    ES_MAX_RETRIES: int = 3
    ES_TIMEOUT: int = 30

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    LOG_CORRELATION_ID_HEADER: str = "X-Correlation-ID"

    # Security
    BCRYPT_ROUNDS: int = 12
    PASSWORD_MIN_LENGTH: int = 12
    PASSWORD_MAX_LENGTH: int = 128
    MAX_LOGIN_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15
    SESSION_IDLE_TIMEOUT_MINUTES: int = 15
    MFA_ISSUER_NAME: str = "ERP Platform"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_DEFAULT: str = "1000/minute"
    RATE_LIMIT_LOGIN: str = "10/minute"
    RATE_LIMIT_PASSWORD_RESET: str = "3/minute"
    RATE_LIMIT_REPORTS: str = "100/minute"
    RATE_LIMIT_EXPORTS: str = "20/minute"
    RATE_LIMIT_UPLOAD: str = "50/minute"

    # Pagination
    PAGINATION_DEFAULT_PAGE_SIZE: int = 25
    PAGINATION_MAX_PAGE_SIZE: int = 100

    # Upload
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_UPLOAD_EXTENSIONS: list[str] = [
        ".jpg", ".jpeg", ".png", ".gif", ".pdf",
        ".doc", ".docx", ".xls", ".xlsx", ".csv",
        ".txt", ".zip",
    ]

    # File paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    TEMP_DIR: Path = BASE_DIR / "temp"

    # Audit
    AUDIT_RETENTION_DAYS: int = 90
    AUDIT_ENABLED: bool = True

    # Search
    SEARCH_ENABLED: bool = True
    SEARCH_INDEX_PREFIX: str = "erp_"

    def model_post_init(self, _context: object) -> None:
        self.TEMP_DIR.mkdir(parents=True, exist_ok=True)


settings = Settings()
