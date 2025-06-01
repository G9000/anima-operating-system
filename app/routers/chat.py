from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.schemas.chat_models import ChatRequest
from app.db.session import get_db
from app.services.chat_service import ChatService
from app.middleware.auth_supabase import get_current_user
from app.models.user import User

router = APIRouter(prefix="/v1")


chat_service = ChatService()

@router.post("/chat/completions", response_model=None)
async def chat_completions(
    request: ChatRequest,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """chat completions endpoint using state graphs."""
    
    result = await db.execute(select(User).filter(User.id == current_user_id))
    current_user = result.scalar_one_or_none()
    
    if not current_user:
        return JSONResponse(
            status_code=401,
            content={"error": "User not found"}
        )
    
    if not chat_service.is_available():
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "message": "Enhanced chat service is not available. Please check Ollama is running.",
                    "type": "server_error",
                    "code": 500
                }
            }
        )    
    try:
        response = await chat_service.process_chat_request(
            request=request,
            user_id=current_user_id,
            db=db
        )
        
        return response
        
    except Exception as e:
        print(f"❌ Enhanced chat processing failed: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "message": str(e),
                    "type": "server_error",
                    "code": 500
                }
            }
        )

@router.get("/health")
async def chat_health():
    """Health check for enhanced chat service."""
    return {
        "service": "chat",
        "available": chat_service.is_available(),
        "features": [
            "state_graphs",
            "chat_modes",
            "construct_integration",
            "system_prompt_injection",
            "memory_management",
            "streaming_support"
        ]
    }
