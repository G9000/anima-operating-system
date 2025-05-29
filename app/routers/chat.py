from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.schemas.chat_models import ChatRequest
from app.db.session import get_db
from app.services.model_service import model_service
from app.services.chat_service import ChatService
from app.services.response_handler import ResponseHandler
from app.middleware.auth_supabase import get_current_user
from app.models.user import User

router = APIRouter(prefix="/v1")


# ============= CHAT ENDPOINTS =============
@router.post("/chat/completions", response_model=None)
async def chat_completions(
    request: ChatRequest,
    current_user_id: UUID = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat completions endpoint with agent support."""
    result = await db.execute(select(User).filter(User.id == current_user_id))
    current_user = result.scalar_one_or_none()
    
    if not current_user:
        return JSONResponse(
            status_code=401,
            content={"error": "User not found"}
        )
    
    langchain_messages = await ChatService.convert_chat_messages_to_langchain(
        request.messages,
        db,
        request.mode
    )
    
    if not model_service.is_available():
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "message": "No model available. Please check Ollama is running.",
                    "type": "server_error",
                    "code": 500
                }
            }
        )
    
    try:
        agent_executor = model_service.create_agent_executor()
        
        if request.stream:
            return await ResponseHandler.stream_chat_response(
                agent_executor, langchain_messages, request.model
            )
        else:
            return await ResponseHandler.sync_chat_response(
                agent_executor, langchain_messages, request.model
            )
            
    except NotImplementedError as e:
        print(f"Tool binding failed: {e}")
        return await ResponseHandler.fallback_chat_response(
            langchain_messages, request.model, request.stream
        )
    except Exception as e:
        print(f"Agent creation failed: {e}")
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




