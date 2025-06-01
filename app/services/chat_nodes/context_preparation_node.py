"""
Context preparation node service.
Handles initial context setup and validation for chat processing.
"""

from typing import Dict, Any
from .base_node import BaseChatNode
from app.services.chat_service import ChatState


class ContextPreparationNode(BaseChatNode):
    """Node for preparing context including construct and system prompt."""
    
    async def process(self, state: ChatState) -> Dict[str, Any]:
        """Prepare context including construct and system prompt."""
        try:
            self._log_processing_start("context preparation")
            
            request_data = state["request_data"]
            
            # Context is already prepared in process_chat_request
            # This node now just validates and passes through
            result = {
                "mode": request_data["mode"],
                "thread_id": request_data["thread_id"],
                "should_stream": request_data["stream"]
            }
            
            self._log_processing_complete(f"mode: {result['mode']}, thread: {result['thread_id']}")
            return result
            
        except Exception as e:
            return self._handle_error(e, "context preparation")
