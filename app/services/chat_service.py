from typing import List, Dict, Any, Optional, Annotated
from typing_extensions import TypedDict
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import logging

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from fastapi.responses import JSONResponse

from app.schemas.chat_models import ChatRequest, SummarizeRequest, SummarizeResponse
from app.services.state_graph_service import state_graph_service
from app.services.model_service import model_service
from app.services.prompt_template_service import prompt_template_service
from app.utils.message_utils import convert_chat_messages_to_langchain
from app.utils.streaming_utils import create_streaming_response
from app.repositories.construct_repository import construct_repository
from app.utils.graph_state_utils import prepare_graph_config, prepare_request_data, prepare_initial_state
from app.utils.conversation_utils import count_new_messages, get_existing_conversation


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
        db: AsyncSession,
        user_id: UUID
    ):
        """Process a chat request using the consolidated graph architecture."""
        try:
            # 1. Load construct data using repository  
            construct_data = await construct_repository.get_construct(
                request.construct_id, db
            )
            
            # 2. Convert messages to LangChain format
            langchain_messages, system_prompt = await convert_chat_messages_to_langchain(
                request.messages, 
                db, 
                request.construct_id, 
                request.mode
            )        
            
            # 3. Handle conversation history using dedicated service
            count_new_messages(langchain_messages)
            
            # 4. Prepare request data using utilities
            config = prepare_graph_config(request.thread_id)            
            
            # 5. Check for existing conversation using dedicated service
            await get_existing_conversation(self.graph, config)
            
            # 6. Prepare request data using dedicated service
            request_data = prepare_request_data(request)

             # 7. Prepare initial state using dedicated service
            initial_state = prepare_initial_state(
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
     
            if request.stream:
                return await create_streaming_response(result)
            else:
                return result.get("response_content", {})
                
        except Exception as e:
            logger.error(f"Error processing chat request: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )

    async def summarize_conversation(
        self,
        request: SummarizeRequest,
        db: AsyncSession,
        user_id: UUID,
        max_messages: Optional[int] = None
    ) -> SummarizeResponse:
        """Summarize a conversation using direct model calls (no graph needed).
        Uses the agent system prompt in journal mode for persona-style summarization.
        """
        try:
            from datetime import datetime
            model = model_service.get_model()
            if not model:
                raise RuntimeError("No model available. Please check Ollama is running.")

    
            construct_data = await construct_repository.get_construct(
                request.construct_id, db
            )


            messages_to_summarize = request.messages
            if max_messages and len(request.messages) > max_messages:
                messages_to_summarize = request.messages[-max_messages:]
                logger.info(f"Limiting summarization to most recent {max_messages} messages out of {len(request.messages)} total")

          
            conversation_text = "\n".join([
                f"{msg.role.upper()}: {msg.content}"
                for msg in messages_to_summarize
                if msg.role in ["user", "assistant"]
            ])

 
            now = datetime.now()
            server_date = now.strftime('%A, %B %d, %Y')
            server_time = now.strftime('%H:%M')


            system_prompt = prompt_template_service.render_system_prompt(
                mode="journal_reflective",
                construct=construct_data,
                construct_id=str(request.construct_id) if request.construct_id else None,
                server_date=server_date,
                server_time=server_time,
                journal_style=getattr(request, "journal_style", "reflective")
            )

            user_prompt = (
                f"Today is {server_date}. The current time is {server_time}. "
                "I met this person for the first time in my life. "
                "Write your thoughts and feelings about what was discussed.\n\n" + conversation_text
            )

            from langchain_core.messages import SystemMessage, HumanMessage
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]

            response = await model.ainvoke(messages)
            summary = response.content

            logger.info(f"Successfully generated journal mode summary for {len(messages_to_summarize)} messages")

            return SummarizeResponse(
                summary=summary,
                message_count=len(messages_to_summarize),
                timestamp=now.isoformat()
            )
        except Exception as e:
            logger.error(f"Error summarizing conversation: {e}")
            raise Exception(f"Failed to summarize conversation: {e}")

    def is_available(self) -> bool:
        """Check if the chat service is available."""
        return self.graph is not None


chat_service = ChatService()
