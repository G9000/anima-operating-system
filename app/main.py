from fastapi import FastAPI
from .routers import chat, construct
from .config.config import setup_logging


# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Setup logging
setup_logging()

app = FastAPI(title="AnimaOS", version="0.1.0")

app.include_router(chat.router, tags=["chat"])
app.include_router(construct.router, tags=["constructs"])


@app.get("/")
async def root():
    return {"message": "Welcome to AnimaOS"}