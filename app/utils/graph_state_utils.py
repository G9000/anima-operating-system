"""
State preparation utilities for chat processing.
"""

import logging
from typing import Dict, Any, List
from uuid import UUID

from langchain_core.messages import BaseMessage
from app.schemas.chat_models import ChatRequest


logger = logging.getLogger(__name__)


def prepare_request_data(request: ChatRequest) -> Dict[str, Any]:
    """Prepare serializable request data from ChatRequest."""
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
    """Prepare initial state for graph processing."""
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
    """Prepare graph configuration."""
    return {"configurable": {"thread_id": thread_id}}


def validate_state(state: Dict[str, Any]) -> bool:
    """Validate state structure."""
    required_fields = ["request_data", "user_id", "messages", "mode", "thread_id"]
    return all(field in state for field in required_fields)
