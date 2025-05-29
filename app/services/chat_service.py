"""
Chat service for handling message processing and conversation logic.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import BaseMessage

from app.schemas.chat_models import AgentChatRequest, ChatMessage
from app.services.instructions import InstructionBuilder
from app.services.message_formatter import MessageFormatter


class ChatService:
    """Service for handling chat-related operations."""

    @staticmethod
    def build_comprehensive_system_instruction(mode: str = "chat") -> str:
        return InstructionBuilder.build_comprehensive_system_instruction(mode)
    
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
        mode: Optional[str] = "chat"    ) -> List[BaseMessage]:
        return await MessageFormatter.convert_chat_messages_to_langchain(messages, db, mode)
