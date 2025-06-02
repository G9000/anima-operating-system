"""
Streaming response utilities for handling token-by-token delivery.
Pure utility functions for creating streaming HTTP responses.
"""

import json
import asyncio
import logging
from typing import Dict, Any
from fastapi.responses import StreamingResponse, JSONResponse


logger = logging.getLogger(__name__)


async def create_streaming_response(result: Dict[str, Any]):
    """Create a proper streaming response with token-by-token delivery."""
    response_content = result.get("response_content", {})
    
    if isinstance(response_content, dict) and "choices" in response_content:
        content = response_content["choices"][0]["message"]["content"]
        base_response = response_content.copy()
        
        async def generate():
            words = content.split()
            
            for i, word in enumerate(words):
                word_with_space = word + (" " if i < len(words) - 1 else "")
                chunk = create_streaming_chunk(
                    base_response=base_response,
                    word=word_with_space,
                    is_first=(i == 0),
                    is_final=False
                )
                
                yield format_sse_data(chunk)
                await asyncio.sleep(0.05)
            
            # Send final completion chunk
            final_chunk = create_streaming_chunk(
                base_response=base_response,
                word="",
                is_first=False,
                is_final=True
            )
            
            yield format_sse_data(final_chunk)
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        )
    
    return JSONResponse(content=response_content)


def create_streaming_chunk(base_response: Dict[str, Any], word: str, is_first: bool = False, is_final: bool = False) -> Dict[str, Any]:
    """Create a single streaming chunk in OpenAI format."""
    if is_final:
        return {
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
    
    chunk = {
        "id": base_response["id"],
        "object": "chat.completion.chunk",
        "created": base_response["created"],
        "model": base_response["model"],
        "choices": [{
            "index": 0,
            "delta": {
                "role": "assistant" if is_first else None,
                "content": word
            },
            "finish_reason": None
        }]
    }
    
    # Remove None values for cleaner output
    if not is_first:
        del chunk["choices"][0]["delta"]["role"]
    
    return chunk


def format_sse_data(data: Dict[str, Any]) -> str:
    """Format data as Server-Sent Events (SSE) format."""
    return f"data: {json.dumps(data)}\n\n"
