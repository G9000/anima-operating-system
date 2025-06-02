"""
Response formatting node service.
Handles formatting of LLM responses to API specification.
"""

import uuid as uuid_lib
from datetime import datetime
from typing import Dict, Any
from .base_node import BaseChatNode
from app.services.chat_service import ChatState
from app.schemas.chat_models import ChatResponse, ChatChoice, ChatMessage, ChatUsage


class ResponseFormattingNode(BaseChatNode):
    """Node for formatting responses according to API specification."""
    
    def _estimate_tokens(self, content) -> int:
        """Rough token estimation for usage tracking."""
        if isinstance(content, list):
            total = 0
            for item in content:
                if hasattr(item, 'content'):
                    total += len(str(item.content).split()) * 1.3
                else:
                    total += len(str(item).split()) * 1.3
            return int(total)
        elif hasattr(content, 'content'):
            return int(len(str(content.content).split()) * 1.3)
        else:
            return int(len(str(content).split()) * 1.3)
    
    async def process(self, state: ChatState) -> Dict[str, Any]:
        """Format response according to API specification."""
        try:
            self._log_processing_start("response formatting")
            
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
            
    
            chat_response.usage.total_tokens = (
                chat_response.usage.prompt_tokens + 
                chat_response.usage.completion_tokens
            )
            
            result = {"response_content": chat_response.model_dump()}
            self._log_processing_complete(f"response formatted with {chat_response.usage.total_tokens} tokens")
            return result
            
        except Exception as e:
            return self._handle_error(e, "response formatting")
