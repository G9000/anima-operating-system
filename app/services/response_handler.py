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
        config: dict,
        model_name: str
    ) -> StreamingResponse:
        """Generate streaming response."""
        thread_id = config.get("configurable", {}).get("thread_id", "unknown")
        print(f"🧠 Starting stream for thread_id: {thread_id}")
        print(f"📝 Input messages: {len(messages)} message(s)")
          # Debug: Check memory state before processing
        try:
            checkpointer = agent_executor.checkpointer
            if checkpointer:
                print(f"🔍 Checkpointer type: {type(checkpointer).__name__}")
                print(f"🔍 Checkpointer ID: {id(checkpointer)}")
                
                # Try to get existing state
                existing_state = await checkpointer.aget(config)
                if existing_state and existing_state.values.get('messages'):
                    print(f"💾 Found existing conversation: {len(existing_state.values['messages'])} messages in memory")
                    for i, msg in enumerate(existing_state.values['messages'][-3:]):  # Show last 3
                        print(f"  📜 {i}: {msg.__class__.__name__}: {msg.content[:50]}...")
                else:
                    print(f"🆕 No existing conversation found for thread_id: {thread_id}")
                    
                # Try to inspect checkpointer storage directly
                if hasattr(checkpointer, 'storage'):
                    print(f"📊 Checkpointer storage keys: {list(checkpointer.storage.keys())}")
                    if thread_id in checkpointer.storage:
                        print(f"✅ Thread {thread_id} exists in storage")
                    else:
                        print(f"❌ Thread {thread_id} NOT found in storage")
                        print(f"🔍 Available threads: {list(checkpointer.storage.keys())[:5]}...")  # Show first 5
            else:
                print(f"⚠️ No checkpointer found in agent!")
        except Exception as e:
            print(f"❌ Error checking memory state: {e}")
            import traceback
            print(f"🔍 Full error: {traceback.format_exc()}")
        
        response_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"
        created_timestamp = int(datetime.now().timestamp())
        
        async def generate() -> AsyncGenerator[str, None]:
            try:
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
                
                
                async for event in agent_executor.astream_events(
                    input={"messages": messages},
                    config=config,
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
        config: dict,
        model_name: str
    ) -> JSONResponse:
        """Generate synchronous response."""
        try:

            response = await agent_executor.ainvoke(
                input={"messages": messages},
                config=config,
            )
        
            assistant_message = None
            for msg in reversed(response.get("messages", [])):
                if isinstance(msg, AIMessage):
                    assistant_message = msg
                    break
            
            content = assistant_message.content if assistant_message else "No response generated."
        
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
            print(f"❌ Sync response error: {e}")
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
                response = await model.ainvoke(messages)
                content = response.content if hasattr(response, 'content') else str(response)
                
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
                
                response = await model.ainvoke(messages)
                content = response.content if hasattr(response, 'content') else str(response)
                
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
                print(f"❌ Fallback streaming error: {e}")
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
