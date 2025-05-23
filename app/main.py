from fastapi import Depends, FastAPI, Request


app = FastAPI(title="AnimaOS", version="0.1.0")

@app.get("/")
async def root():
    return {"message": "Welcome to AnimaOS"}