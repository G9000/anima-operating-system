"""
Graph State utility functions for chat processing.
Handles initial state setup and request data transformation.
"""

from typing import Dict, Any, List
from uuid import UUID

from langchain_core.messages import BaseMessage
from app.schemas.chat_models import ChatRequest


def prepare_request_data(request: ChatRequest) -> Dict[str, Any]:
    """
    Prepare serializable request data from ChatRequest.
    
    Args:
        request: The incoming chat request
        
    Returns:
        Dictionary with serializable request data
    """
    return {
        "model": request.model,
        "mode": request.mode,
        "thread_id": request.thread_id,
        "stream": request.stream,
        "temperature": request.temperature,
        "max_tokens": request.max_tokens,
        "construct_id": str(request.construct_id) if request.construct_id else None
    }


def prepare_initial_state(
    request_data: Dict[str, Any],
    user_id: UUID,
    construct_data: Dict[str, Any],
    langchain_messages: List[BaseMessage],
    system_prompt: str,
    mode: str,
    thread_id: str,
    should_stream: bool
) -> Dict[str, Any]:
    """
    Prepare initial state for graph processing.
    
    Args:
        request_data: Prepared request data dictionary
        user_id: User identifier
        construct_data: Construct data dictionary
        langchain_messages: List of formatted messages
        system_prompt: Generated system prompt
        mode: Chat mode (chat, roleplay, etc.)
        thread_id: Thread identifier for memory
        should_stream: Whether to stream responses
        
    Returns:
        Dictionary with initial state for graph processing
    """
    return {
        "request_data": request_data,
        "user_id": str(user_id),
        "construct_data": construct_data,
        "messages": langchain_messages,
        "mode": mode,
        "thread_id": thread_id,
        "should_stream": should_stream,
        "system_prompt": system_prompt 
    }


def prepare_graph_config(thread_id: str) -> Dict[str, Any]:
    """
    Prepare graph configuration for LangGraph.
    
    Args:
        thread_id: Thread identifier for memory
        
    Returns:
        Configuration dictionary for graph execution
    """
    return {"configurable": {"thread_id": thread_id}}


def validate_state(state: Dict[str, Any]) -> bool:
    """
    Validate state structure has all required fields.
    
    Args:
        state: State dictionary to validate
        
    Returns:
        True if state is valid, False otherwise
    """
    required_fields = ["request_data", "user_id", "messages", "mode", "thread_id"]
    return all(field in state for field in required_fields)
