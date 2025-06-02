from typing import List, Dict, Any, Optional, Annotated
from typing_extensions import TypedDict
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import logging

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from fastapi.responses import JSONResponse

from app.schemas.chat_models import ChatRequest
from app.services.state_graph_service import state_graph_service
from app.services.message_formatter import MessageFormatter
from app.services.streaming_service import streaming_service
from app.repositories.construct_repository import construct_repository
from app.services.state_preparation_service import state_preparation_service
from app.services.conversation_history_service import conversation_history_service


logger = logging.getLogger(__name__)

class ChatState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    request_data: Optional[Dict[str, Any]] 
    user_id: Optional[str]
    construct_data: Optional[Dict[str, Any]]
    system_prompt: Optional[str]
    mode: str
    thread_id: str
    response_content: Optional[str]
    error: Optional[str]
    should_stream: bool

class ChatService:
    """
    Orchestrates chat requests by delegating to specialized services.
    """
    
    def __init__(self):
        self.graph = None
        self._initialize_service()    
    
    def _initialize_service(self):
        """Initialize the chat graph using consolidated graph service."""
        try:
            self.graph = state_graph_service.create_chat_graph(ChatState)
        except Exception as e:
            raise Exception(f"Failed to initialize chat service: {e}")

    async def process_chat_request(
        self, 
        request: ChatRequest,
        user_id: UUID, 
        db: AsyncSession
    ):
        """
        Process a chat request by orchestrating calls to specialized services.
        """
        try:            
            # 1. Load construct data using repository
            construct_data = await construct_repository.get_construct(
                request.construct_id, db
            )
            
            # 2. Convert messages to LangChain format
            langchain_messages, system_prompt = await MessageFormatter.convert_chat_messages_to_langchain(
                request.messages,
                db,
                request.construct_id,
                request.mode
            )
            
            # 3. Handle conversation history using dedicated service
            conversation_history_service.count_new_messages(langchain_messages)
            
            # 4. Prepare graph configuration using dedicated service
            config = state_preparation_service.prepare_graph_config(request.thread_id)
            
            # 5. Check for existing conversation using dedicated service
            await conversation_history_service.get_existing_conversation(self.graph, config)
            
            # 6. Prepare request data using dedicated service
            request_data = state_preparation_service.prepare_request_data(request)
            
            # 7. Prepare initial state using dedicated service
            initial_state = state_preparation_service.prepare_initial_state(
                request_data=request_data,
                user_id=user_id,
                construct_data=construct_data,
                langchain_messages=langchain_messages,
                system_prompt=system_prompt,
                mode=request.mode,
                thread_id=request.thread_id,
                should_stream=request.stream
            )
                
            # 8. Execute graph (consolidated in state_graph_service)
            result = await self.graph.ainvoke(initial_state, config=config)
            
            if result.get("error"):
                return JSONResponse(
                    status_code=500,
                    content={"error": result["error"]}
                )
     
            # 9. Handle response using dedicated streaming service
            if request.stream:
                return await streaming_service.create_streaming_response(result)
            else:
                return result.get("response_content", {})
            
        except Exception as e:
            logger.error(f"Error processing chat request: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    def is_available(self) -> bool:
        """Check if the chat service is available."""
        return self.graph is not None


chat_service = ChatService()
