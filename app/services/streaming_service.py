"""
Streaming response service for handling token-by-token delivery.
Separated from the main chat service for better modularity.
"""

import json
import asyncio
import logging
from typing import Dict, Any
from fastapi.responses import StreamingResponse, JSONResponse


class StreamingService:
    """Service for creating and managing streaming responses."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def create_streaming_response(self, result: Dict[str, Any]) -> StreamingResponse:
        """Create a proper streaming response with token-by-token delivery."""
        response_content = result.get("response_content", {})
        
        if isinstance(response_content, dict) and "choices" in response_content:
            content = response_content["choices"][0]["message"]["content"]
            base_response = response_content.copy()
            
            # Create proper SSE streaming
            async def generate():
                self.logger.debug(f"Starting streaming response for {len(content)} characters")
                
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
                    
                    yield f"data: {json.dumps(chunk)}\\n\\n"
                
                    await asyncio.sleep(0.05)
                
                # Send final completion chunk
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
                
                yield f"data: {json.dumps(final_chunk)}\\n\\n"
                yield "data: [DONE]\\n\\n"
                
                self.logger.debug("Streaming response completed")
            
            return StreamingResponse(
                generate(),
                media_type="text/plain",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive"
                }
            )
        
        self.logger.warning("Non-streaming response fallback used")
        return JSONResponse(content=response_content)


# Global instance
streaming_service = StreamingService()
