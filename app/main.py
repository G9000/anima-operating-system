from fastapi import FastAPI
from .routers import chat

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


app = FastAPI(title="AnimaOS", version="0.1.0")

app.include_router(chat.router, tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to AnimaOS"}