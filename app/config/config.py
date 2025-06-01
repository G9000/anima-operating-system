from pydantic_settings import BaseSettings
import logging
import sys

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@127.0.0.1:54322/postgres"
    ollama_url:   str = "http://localhost:11434"
    log_level: str = "INFO"

settings = Settings()

def setup_logging():
    """Setup logging configuration for the application."""
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%H:%M:%S',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set specific loggers to reduce noise
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
