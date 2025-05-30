"""
Chat service for handling message processing and conversation logic.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import BaseMessage
import uuid

from app.schemas.chat_models import AgentChatRequest, ChatMessage
from app.services.template_service import template_service
from app.services.message_formatter import MessageFormatter


class ChatService:
    """Service for handling chat-related operations."""

    @staticmethod
    def build_comprehensive_system_instruction(mode: str = "chat") -> str:
        return template_service.render_system_prompt(mode=mode)
    
    @staticmethod
    async def format_chat_history(
        request: AgentChatRequest, 
        db: AsyncSession = None
    ) -> List[BaseMessage]:
        return await MessageFormatter.format_chat_history(request, db)
    
    @staticmethod
    async def convert_chat_messages_to_langchain(
        messages: List[ChatMessage], 
        db: AsyncSession,
        construct_id: uuid.UUID,
        mode: str = "chat"
    ) -> List[BaseMessage]:
        return await MessageFormatter.convert_chat_messages_to_langchain(messages, db, construct_id, mode)
