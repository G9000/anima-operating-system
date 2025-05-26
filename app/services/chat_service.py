"""
Chat service for handling message processing and conversation logic.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage

from app.schemas.chat_models import AgentChatRequest, ChatMessage


CHAT_PROMPT = (
    "You are AnimaOS, a friendly and professional AI assistant."
)


class ChatService:
    """Service for handling chat-related operations."""
    
    @staticmethod
    async def format_chat_history(
        agent_chat_request: AgentChatRequest, 
        db: AsyncSession = None
    ) -> List[BaseMessage]:
        """Format agent chat request to LangChain messages."""
        formatted_messages = []
        formatted_messages.append(
            SystemMessage(
                content=CHAT_PROMPT,
                name="System",
            )
        )
        
        for ch in agent_chat_request.chat_history:
            formatted_messages.append(HumanMessage(content=ch.query, name="User"))
            formatted_messages.append(AIMessage(content=ch.response, name="Model"))
        
        formatted_messages.append(
            HumanMessage(content=agent_chat_request.query, name="User")
        )
        
        return formatted_messages

    @staticmethod
    async def convert_chat_messages_to_langchain(
        chat_messages: List[ChatMessage],
        db: AsyncSession
    ) -> List[BaseMessage]:
        """Convert chat format messages to LangChain format."""
        langchain_messages = []
        
        system_content = CHAT_PROMPT
        
        if chat_messages and chat_messages[0].role == "system":
            system_content = chat_messages[0].content
            chat_messages = chat_messages[1:]
        
        langchain_messages.append(SystemMessage(content=system_content))
        
        for msg in chat_messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                langchain_messages.append(SystemMessage(content=msg.content))
        
        return langchain_messages
