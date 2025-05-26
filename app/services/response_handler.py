"""
Response handlers for chat completions (streaming and synchronous).
"""
import json
import uuid
from datetime import datetime
from typing import List, AsyncGenerator

from fastapi.responses import StreamingResponse, JSONResponse
from langchain_core.messages import BaseMessage, AIMessage
from langgraph.graph.graph import CompiledGraph

from app.services.model_service import model_service


class ResponseHandler:
    """Handler for chat response generation."""
    
    @staticmethod
    async def stream_chat_response(
        agent_executor: CompiledGraph, 
        messages: List[BaseMessage], 
        model_name: str
    ) -> StreamingResponse:
        """Generate streaming response."""
        response_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"
        created_timestamp = int(datetime.now().timestamp())
        
        async def generate() -> AsyncGenerator[str, None]:
            try:
                # Send initial chunk with role
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {'role': 'assistant'},
                        'finish_reason': None
                    }]
                })}\n\n"
                
                # Stream content using the correct stream mode
                async for event in agent_executor.astream_events(
                    input={"messages": messages},
                    version="v2"
                ):
                    
                    if event["event"] == "on_chat_model_stream":
                        content = event["data"]["chunk"].content
                        if content:
                            yield f"data: {json.dumps({
                                'id': response_id,
                                'object': 'chat.completion.chunk',
                                'created': created_timestamp,
                                'model': model_name,
                                'choices': [{
                                    'index': 0,
                                    'delta': {'content': content},
                                    'finish_reason': None
                                }]
                            })}\n\n"
                    
                    elif event["event"] == "on_chain_end":
                        pass
                
                # Send finish chunk
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {},
                        'finish_reason': 'stop'
                    }]
                })}\n\n"
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                print(f"Streaming error: {e}")
                # Send error in standard format
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {'content': f'\\n\\nError: {str(e)}'},
                        'finish_reason': 'error'
                    }]
                })}\n\n"
                yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "Transfer-Encoding": "chunked"
            }
        )

    @staticmethod    
    async def sync_chat_response(
        agent_executor: CompiledGraph, 
        messages: List[BaseMessage], 
        model_name: str
    ) -> JSONResponse:
        """Generate synchronous response."""
        try:
            response = await agent_executor.ainvoke(
                input={"messages": messages}
            )
            
            # Extract assistant message from response
            assistant_message = None
            for msg in reversed(response.get("messages", [])):
                if isinstance(msg, AIMessage):
                    assistant_message = msg
                    break
            
            content = assistant_message.content if assistant_message else "No response generated."
            
            # Estimate tokens (rough approximation)
            prompt_tokens = sum(len(m.content.split()) * 1.3 for m in messages)
            completion_tokens = len(content.split()) * 1.3
            
            return JSONResponse(content={
                "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                "object": "chat.completion",
                "created": int(datetime.now().timestamp()),
                "model": model_name,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": content
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": int(prompt_tokens),
                    "completion_tokens": int(completion_tokens),
                    "total_tokens": int(prompt_tokens + completion_tokens)
                }
            })
        except Exception as e:
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

    @staticmethod
    async def fallback_chat_response(
        messages: List[BaseMessage], 
        model_name: str, 
        stream: bool = False
    ) -> JSONResponse | StreamingResponse:
        """Fallback response when tool binding is not supported."""
        try:
            model = model_service.get_model()
            if not model:
                raise RuntimeError("No model available")
            
            if stream:
                return await ResponseHandler._fallback_stream_response(messages, model_name, model)
            else:
                # Generate a response using the model directly
                response = await model.ainvoke(messages)
                content = response.content if hasattr(response, 'content') else str(response)
                
                # Estimate tokens (rough approximation)
                prompt_tokens = sum(len(m.content.split()) * 1.3 for m in messages)
                completion_tokens = len(content.split()) * 1.3
                
                return JSONResponse(content={
                    "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                    "object": "chat.completion",
                    "created": int(datetime.now().timestamp()),
                    "model": model_name,
                    "choices": [{
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": content + "\n\n📧 **Email functionality is available!** You can also use these direct API endpoints:\n• GET /v1/email/check - Check recent emails\n• GET /v1/email/folders - List email folders\n• GET /v1/email/config/test - Test email setup"
                        },
                        "finish_reason": "stop"
                    }],
                    "usage": {
                        "prompt_tokens": int(prompt_tokens),
                        "completion_tokens": int(completion_tokens),
                        "total_tokens": int(prompt_tokens + completion_tokens)
                    }
                })
        except Exception as e:
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

    @staticmethod
    async def _fallback_stream_response(
        messages: List[BaseMessage], 
        model_name: str, 
        model
    ) -> StreamingResponse:
        """Fallback streaming response when tool binding is not supported."""
        response_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"
        created_timestamp = int(datetime.now().timestamp())
        
        async def generate() -> AsyncGenerator[str, None]:
            try:
                # Send initial chunk with role
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {'role': 'assistant'},
                        'finish_reason': None
                    }]
                })}\n\n"
                
                # Get response from model
                response = await model.ainvoke(messages)
                content = response.content if hasattr(response, 'content') else str(response)
                
                # Stream the content in chunks
                words = content.split()
                for i, word in enumerate(words):
                    chunk_content = word + (" " if i < len(words) - 1 else "")
                    yield f"data: {json.dumps({
                        'id': response_id,
                        'object': 'chat.completion.chunk',
                        'created': created_timestamp,
                        'model': model_name,
                        'choices': [{
                            'index': 0,
                            'delta': {'content': chunk_content},
                            'finish_reason': None
                        }]
                    })}\n\n"
                
                # Add email functionality note
                email_note = "\n\n📧 **Email functionality is available!** You can also use these direct API endpoints:\n• GET /v1/email/check - Check recent emails\n• GET /v1/email/folders - List email folders\n• GET /v1/email/config/test - Test email setup"
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {'content': email_note},
                        'finish_reason': None
                    }]
                })}\n\n"
                
                # Send finish chunk
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {},
                        'finish_reason': 'stop'
                    }]
                })}\n\n"
                
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                print(f"Fallback streaming error: {e}")
                yield f"data: {json.dumps({
                    'id': response_id,
                    'object': 'chat.completion.chunk',
                    'created': created_timestamp,
                    'model': model_name,
                    'choices': [{
                        'index': 0,
                        'delta': {'content': f'\\n\\nError: {str(e)}'},
                        'finish_reason': 'error'
                    }]
                })}\n\n"
                yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "Transfer-Encoding": "chunked"
            }
        )
