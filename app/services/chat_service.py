from typing import List, Dict, Any, Optional, Annotated
from typing_extensions import TypedDict
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import json
import uuid as uuid_lib
import asyncio
from datetime import datetime

from langchain_core.messages import BaseMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from fastapi.responses import StreamingResponse, JSONResponse

from app.schemas.chat_models import ChatRequest, ChatMessage, ChatChoice, ChatUsage, ChatResponse
from app.services.state_graph_service import state_graph_service
from app.services.template_service import template_service
from app.services.message_formatter import MessageFormatter
from app.crud.construct import get_construct_by_id

class ChatState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    request_data: Optional[Dict[str, Any]] 
    user_id: Optional[str]
    construct_data: Optional[Dict[str, Any]]
    system_prompt: Optional[str]
    mode: str
    thread_id: str
    
    # Response context
    response_content: Optional[str]
    error: Optional[str]
    should_stream: bool

class ChatService:
    def __init__(self):
        self.graph = None
        self.memory_saver = MemorySaver()
        self._initialize_service()    
    
    def _initialize_service(self):
        """Initialize the chat graph."""
        try:
            self.graph = self._create_enhanced_chat_graph()
        except Exception as e:
            raise Exception(f"Failed to initialize chat service: {e}")
    
    def _create_enhanced_chat_graph(self):
        """Create the enhanced chat processing graph."""
        async def context_preparation_node(state: ChatState):
            """Prepare context including construct and system prompt."""            
            try:
                request_data = state["request_data"]
                # Context is already prepared in process_chat_request
                # This node now just validates and passes through
                return {
                    "mode": request_data["mode"],
                    "thread_id": request_data["thread_id"],
                    "should_stream": request_data["stream"]
                }
                
            except Exception as e:
                return {"error": f"Context preparation failed: {str(e)}"}
        
        async def system_prompt_injection_node(state: ChatState):
            """Inject system prompt based on mode and construct."""
            try:
                system_prompt = state.get("system_prompt")
                messages = state.get("messages", [])
                
                # Check if there's already a system message in the conversation
                has_system_message = any(isinstance(msg, SystemMessage) for msg in messages)
                
                if system_prompt and not has_system_message:
                    system_message = SystemMessage(content=system_prompt)
                    messages = [system_message] + messages
                elif has_system_message:
                    print(f"🔄 System message already exists, skipping injection")
                else:
                    print(f"⚠️ No system prompt to inject")
                
                return {"messages": messages}
                
            except Exception as e:
                return {"error": f"System prompt injection failed: {str(e)}"}
        
        async def llm_processing_node(state: ChatState):
            """Process messages through LLM with mode-aware configuration."""
            try:
                request_data = state["request_data"]
                messages = state.get("messages", [])
                mode = state.get("mode", "chat")
            
                model_kwargs = {
                    "temperature": request_data.get("temperature") or self._get_mode_temperature(mode),
                }
                
                llm_chain = state_graph_service.create_llm_chain(
                    model_name=request_data["model"],
                    system_message="", 
                    **model_kwargs
                )
                
                print(f"🤖 Processing with model: {request_data['model']}, mode: {mode}")
                
                response = await llm_chain.ainvoke({"messages": messages})
                
                response_content = response.content if hasattr(response, 'content') else str(response)
                print(f"✅ LLM response generated: {len(response_content)} chars")
                
                return {
                    "response_content": response_content,
                    "messages": [response] 
                }
                
            except Exception as e:
                print(f"❌ Error in LLM processing: {e}")
                return {"error": f"LLM processing failed: {str(e)}"}
        
        async def response_formatting_node(state: ChatState):
            """Format response according to API specification."""
            try:
                request_data = state["request_data"]
                response_content = state.get("response_content", "")
                
                if state.get("error"):
                    return {"error": state["error"]}
                
                # Create OpenAI-compatible response
                chat_response = ChatResponse(
                    id=f"chatcmpl-{uuid_lib.uuid4()}",
                    created=int(datetime.now().timestamp()),
                    model=request_data["model"],
                    choices=[
                        ChatChoice(
                            index=0,
                            message=ChatMessage(
                                role="assistant",
                                content=response_content
                            ),
                            finish_reason="stop"
                        )
                    ],
                    usage=ChatUsage(
                        prompt_tokens=self._estimate_tokens(state.get("messages", [])),
                        completion_tokens=self._estimate_tokens([response_content]),
                        total_tokens=0
                    )
                )
                
                # Calculate total tokens
                chat_response.usage.total_tokens = (
                    chat_response.usage.prompt_tokens + 
                    chat_response.usage.completion_tokens
                )
                
                print(f"📋 Formatted response for API compatibility")
                return {"response_content": chat_response.model_dump()}
                
            except Exception as e:
                print(f"❌ Error in response formatting: {e}")
                return {"error": f"Response formatting failed: {str(e)}"}
        
        # Build the graph
        graph_builder = StateGraph(ChatState)
        
        # Add nodes
        graph_builder.add_node("context_preparation", context_preparation_node)
        graph_builder.add_node("system_prompt_injection", system_prompt_injection_node)
        graph_builder.add_node("llm_processing", llm_processing_node)
        graph_builder.add_node("response_formatting", response_formatting_node)
        
        # Add edges
        graph_builder.add_edge(START, "context_preparation")
        graph_builder.add_edge("context_preparation", "system_prompt_injection")
        graph_builder.add_edge("system_prompt_injection", "llm_processing")
        graph_builder.add_edge("llm_processing", "response_formatting")
        graph_builder.add_edge("response_formatting", END)
        
        # Compile with memory
        return graph_builder.compile(checkpointer=self.memory_saver)
    
    def _generate_system_prompt(self, request_data: Dict[str, Any], construct_data: Optional[Dict[str, Any]]) -> str:
        """Generate system prompt based on request and construct data."""
        try:
            mode = request_data.get("mode", "chat")
            
            if construct_data:
                # Use construct-based system prompt
                return template_service.get_construct_system_prompt(
                    construct_data, 
                    mode
                )
            else:
                # Use default mode-based system prompt
                return template_service.get_mode_system_prompt(mode)
                
        except Exception as e:
            print(f"⚠️ Error generating system prompt: {e}")
            return "You are a helpful AI assistant."
    
    def _get_mode_temperature(self, mode: str) -> float:
        """Get temperature setting based on chat mode."""
        mode_temperatures = {
            "chat": 0.7,
            "roleplay": 0.8,
            "journal": 0.6,
            "story": 0.9,
            "assist": 0.3,
            "silent": 0.5
        }
        return mode_temperatures.get(mode, 0.7)
    
    def _estimate_tokens(self, content) -> int:
        """Rough token estimation for usage tracking."""
        if isinstance(content, list):
            total = 0
            for item in content:
                if hasattr(item, 'content'):
                    total += len(str(item.content).split()) * 1.3  # Rough estimation
                else:
                    total += len(str(item).split()) * 1.3
            return int(total)
        else:
            return int(len(str(content).split()) * 1.3)

    async def process_chat_request(
        self, 
        request: ChatRequest,
        user_id: UUID, 
        db: AsyncSession
    ):
        """Process a chat request through the enhanced state graph."""
        
        try:
            # Fetch construct data before entering the graph (database operations outside graph)
            construct_data = None
            if request.construct_id:
                try:
                    construct = await get_construct_by_id(db, request.construct_id)
                    print(f"🔍 Fetching construct with ID: {request.construct_id}")
                    print("🔍 Construct found:", construct)
                    if construct:
                        if hasattr(construct, "model_dump"):
                            construct_data = construct.model_dump()
                        else:
                            construct_data = {k: v for k, v in construct.__dict__.items() if not k.startswith("_")}
                        print(f"👤 Loaded construct: {construct_data.get('name')}")
                except Exception as e:
                    print(f"⚠️ Error fetching construct {request.construct_id}: {e}")
            
            # Convert only the new messages to LangChain format 
            # The graph's MemorySaver will handle merging with conversation history
            langchain_messages, system_prompt = await MessageFormatter.convert_chat_messages_to_langchain(
                request.messages,
                db,
                request.construct_id,
                request.mode
            )
            
            print(f"📝 Current request has {len(langchain_messages)} new messages")
            
            # Check if we have existing conversation history
            config = {"configurable": {"thread_id": request.thread_id}}
            try:
                # Try to get existing state to see conversation history
                existing_state = await self.graph.aget_state(config)
                if existing_state and existing_state.values.get("messages"):
                    existing_messages = existing_state.values["messages"]
                    print(f"🧠 Found existing conversation with {len(existing_messages)} messages")
                    
                    # Log the existing messages for debugging
                    for i, msg in enumerate(existing_messages):
                        print(f"  Msg {i}: {type(msg).__name__}: {msg.content[:50]}...")
                else:
                    print(f"🆕 No existing conversation found for thread {request.thread_id}")
            except Exception as e:
                print(f"⚠️ Could not retrieve existing state: {e}")
            
            # Prepare serializable request data
            request_data = {
                "model": request.model,
                "mode": request.mode,
                "thread_id": request.thread_id,
                "stream": request.stream,
                "temperature": request.temperature,
                "max_tokens": request.max_tokens,
                "construct_id": str(request.construct_id) if request.construct_id else None
            }
            
            # Prepare initial state with only NEW messages
            # The graph's add_messages will automatically merge with existing conversation
            initial_state = {
                "request_data": request_data,
                "user_id": str(user_id),
                "construct_data": construct_data,
                "messages": langchain_messages,  # Only new messages - graph will merge with history
                "mode": request.mode,
                "thread_id": request.thread_id,
                "should_stream": request.stream,
                "system_prompt": system_prompt  # Pre-generated system prompt
            }
            
            config = {"configurable": {"thread_id": request.thread_id}}
            
            print(f"🚀 Starting enhanced chat processing for thread: {request.thread_id}")
            
            # Process through the graph
            result = await self.graph.ainvoke(initial_state, config=config)
            
            # Check for errors
            if result.get("error"):
                return JSONResponse(
                    status_code=500,
                    content={"error": result["error"]}
                )
            
            # Handle streaming vs sync response
            if request.stream:
                return await self._create_streaming_response(result)
            else:
                return result.get("response_content", {})
            
        except Exception as e:
            print(f"❌ Error processing chat request: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )
    
    async def _create_streaming_response(self, result: Dict[str, Any]):
        """Create a proper streaming response with token-by-token delivery."""
        response_content = result.get("response_content", {})
        
        if isinstance(response_content, dict) and "choices" in response_content:
            content = response_content["choices"][0]["message"]["content"]
            base_response = response_content.copy()
              # Create proper SSE streaming
            async def generate():
                # Split content into words for streaming simulation
                words = content.split()
                
                for i, word in enumerate(words):
                    # Create streaming chunk in OpenAI format
                    chunk = {
                        "id": base_response["id"],
                        "object": "chat.completion.chunk",
                        "created": base_response["created"],
                        "model": base_response["model"],
                        "choices": [{
                            "index": 0,
                            "delta": {
                                "role": "assistant" if i == 0 else None,
                                "content": word + (" " if i < len(words) - 1 else "")
                            },
                            "finish_reason": None
                        }]
                    }
                    
                    # Remove None values for cleaner output
                    if chunk["choices"][0]["delta"]["role"] is None:
                        del chunk["choices"][0]["delta"]["role"]
                    
                    yield f"data: {json.dumps(chunk)}\n\n"
                    
                    # Small delay to simulate real streaming
                    await asyncio.sleep(0.05)
                
                # Send final chunk with finish_reason
                final_chunk = {
                    "id": base_response["id"],
                    "object": "chat.completion.chunk",
                    "created": base_response["created"],
                    "model": base_response["model"],
                    "choices": [{
                        "index": 0,
                        "delta": {},
                        "finish_reason": "stop"
                    }]
                }
                
                yield f"data: {json.dumps(final_chunk)}\n\n"
                yield "data: [DONE]\n\n"
            
            return StreamingResponse(
                generate(),
                media_type="text/plain",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive"
                }
            )
        
        return JSONResponse(content=response_content)
    
    def is_available(self) -> bool:
        """Check if the enhanced chat service is available."""
        return self.graph is not None
    
    def clear_memory(self, thread_id: str = None):
        """Clear conversation memory."""
        if thread_id and hasattr(self.memory_saver, 'storage'):
            if thread_id in self.memory_saver.storage:
                del self.memory_saver.storage[thread_id]
                print(f"🧹 Cleared memory for thread: {thread_id}")
        else:
            self.memory_saver = MemorySaver()
            print("🧹 Cleared all memory")


# Global instance
chat_service = ChatService()
