# backend/app/core/config.py
# pydantic_settings:把环境变量、.env 文件、配置项，统一“强类型 + 自动校验”地管理的library
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    ENV: str = "dev"


settings = Settings()