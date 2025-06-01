"""
Memory management service for chat conversations.
Handles memory operations separately from chat processing.
"""

import logging
from typing import Optional
from langgraph.checkpoint.memory import MemorySaver


class MemoryService:
    """Service for managing chat conversation memory."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.memory_saver = MemorySaver()
    
    def get_memory_saver(self) -> MemorySaver:
        """Get the memory saver instance."""
        return self.memory_saver
    
    def clear_memory(self, thread_id: Optional[str] = None) -> None:
        """Clear conversation memory."""
        if thread_id and hasattr(self.memory_saver, 'storage'):
            if thread_id in self.memory_saver.storage:
                del self.memory_saver.storage[thread_id]
                self.logger.info(f"Cleared memory for thread: {thread_id}")
            else:
                self.logger.debug(f"No memory found for thread: {thread_id}")
        else:
            self.memory_saver = MemorySaver()
            self.logger.info("Cleared all memory")
    
    def get_conversation_history(self, thread_id: str) -> Optional[dict]:
        """Get conversation history for a thread."""
        try:
            if hasattr(self.memory_saver, 'storage') and thread_id in self.memory_saver.storage:
                history = self.memory_saver.storage[thread_id]
                self.logger.debug(f"Retrieved history for thread {thread_id}: {len(history.get('messages', []))} messages")
                return history
            else:
                self.logger.debug(f"No history found for thread: {thread_id}")
                return None
        except Exception as e:
            self.logger.error(f"Error retrieving conversation history for {thread_id}: {e}")
            return None
    
    def has_conversation_history(self, thread_id: str) -> bool:
        """Check if a thread has existing conversation history."""
        try:
            return (hasattr(self.memory_saver, 'storage') and 
                   thread_id in self.memory_saver.storage and
                   bool(self.memory_saver.storage[thread_id].get('messages')))
        except Exception as e:
            self.logger.error(f"Error checking conversation history for {thread_id}: {e}")
            return False


# Global instance
memory_service = MemoryService()
