from fastapi import FastAPI
from .routers import chat, construct, simple_chat


# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


app = FastAPI(title="AnimaOS", version="0.1.0")

app.include_router(chat.router, tags=["chat"])
app.include_router(construct.router, tags=["constructs"])
app.include_router(simple_chat.router, tags=["simple-chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to AnimaOS"}