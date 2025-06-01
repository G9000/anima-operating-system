"""
Base class for chat node services.
Provides common functionality and logging for all chat nodes.
"""

import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from app.services.chat_service import ChatState


class BaseChatNode(ABC):
    """Base class for all chat processing nodes."""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
    
    @abstractmethod
    async def process(self, state: "ChatState") -> Dict[str, Any]:
        """Process the chat state and return updates."""
        pass
    
    def _handle_error(self, error: Exception, context: str = "") -> Dict[str, Any]:
        """Common error handling for all nodes."""
        error_msg = f"{self.__class__.__name__} failed"
        if context:
            error_msg += f" during {context}"
        error_msg += f": {str(error)}"
        
        self.logger.error(error_msg)
        return {"error": error_msg}
    
    def _log_processing_start(self, context: str = ""):
        """Log the start of node processing."""
        msg = f"Starting {self.__class__.__name__} processing"
        if context:
            msg += f" for {context}"
        self.logger.debug(msg)
    
    def _log_processing_complete(self, result_summary: str = ""):
        """Log the completion of node processing."""
        msg = f"Completed {self.__class__.__name__} processing"
        if result_summary:
            msg += f": {result_summary}"
        self.logger.debug(msg)
