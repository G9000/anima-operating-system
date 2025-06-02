"""
Conversation history utilities for managing chat history operations.
Handles conversation history retrieval and logging.
"""

import logging
from typing import Optional, Dict, Any, List
from langchain_core.messages import BaseMessage

logger = logging.getLogger(__name__)


async def get_existing_conversation(
    graph, 
    config: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Get existing conversation state from graph."""
    try:
        existing_state = await graph.aget_state(config)
        if existing_state and existing_state.values.get("messages"):
            existing_messages = existing_state.values["messages"]
            logger.info(f"Found existing conversation with {len(existing_messages)} messages")
            
            # Log the existing messages for debugging
            _log_existing_messages(existing_messages)
            
            return existing_state.values
        else:
            thread_id = config.get("configurable", {}).get("thread_id", "unknown")
            logger.info(f"No existing conversation found for thread {thread_id}")
            return None
            
    except Exception as e:
        logger.warning(f"Could not retrieve existing state: {e}")
        return None


def _log_existing_messages(messages: List[BaseMessage]) -> None:
    """Log existing messages for debugging."""
    for i, msg in enumerate(messages):
        logger.debug(f"  Msg {i}: {type(msg).__name__}: {msg.content[:50]}...")


def count_new_messages(messages: List[BaseMessage]) -> int:
    """Count and log new messages."""
    count = len(messages)
    logger.info(f"Current request has {count} new messages")
    return count


def validate_conversation_state(state: Optional[Dict[str, Any]]) -> bool:
    """Validate conversation state structure."""
    if not state:
        return True  # No existing state is valid
    
    return "messages" in state and isinstance(state["messages"], list)
