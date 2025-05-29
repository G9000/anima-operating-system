"""
Service for formatting and converting chat messages between different formats.
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage

from app.schemas.chat_models import AgentChatRequest, ChatMessage
from .instructions.instruction_builder import InstructionBuilder


class MessageFormatter:
    """Service for formatting and converting chat messages."""
   
    @staticmethod
    async def format_chat_history(
        agent_chat_request: AgentChatRequest, 
        db: AsyncSession = None
    ) -> List[BaseMessage]:
        
        formatted_messages = []
        
        mode = getattr(agent_chat_request, 'mode', 'chat')
        system_content = InstructionBuilder.build_comprehensive_system_instruction(mode)
        
        formatted_messages.append(SystemMessage(content=system_content))
        
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
        db: AsyncSession,
        mode: str = "chat"
    ) -> List[BaseMessage]:
        langchain_messages = []
        
        system_content = InstructionBuilder.build_comprehensive_system_instruction(mode)
        
        if chat_messages and chat_messages[0].role == "system":
            custom_system = chat_messages[0].content
            system_content = f"{system_content}\n\n=== ADDITIONAL INSTRUCTIONS ===\n{custom_system}"
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
