"""
Service for formatting and converting chat messages between different formats.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
import uuid

from app.schemas.chat_models import AgentChatRequest, ChatMessage
from app.crud.construct import get_construct_by_id
from .template_service import template_service


class MessageFormatter:
    """Service for formatting and converting chat messages."""
    
    @staticmethod
    async def format_chat_history(
        agent_chat_request: AgentChatRequest, 
    ) -> List[BaseMessage]:
        
        formatted_messages = []
        
        mode = getattr(agent_chat_request, 'mode', 'chat')
        system_content = template_service.render_system_prompt(mode=mode)
        
        formatted_messages.append(SystemMessage(content=system_content))
        
        for ch in agent_chat_request.chat_history:
            formatted_messages.append(HumanMessage(content=ch.query, name="User"))
            formatted_messages.append(AIMessage(content=ch.response, name="Model"))
        
        formatted_messages.append(
            HumanMessage(content=agent_chat_request.query, name="User")
        )
        return formatted_messages    @staticmethod
    async def convert_chat_messages_to_langchain(
        chat_messages: List[ChatMessage],
        db: AsyncSession,
        construct_id: uuid.UUID,
        mode: str = "chat",
    ) -> tuple[List[BaseMessage], Optional[str]]:
        """
        Convert chat messages to langchain format.
        Now optimized for InMemorySaver - expects only current message,
        conversation history will be handled by InMemorySaver checkpointer.
        
        Returns:
            tuple: (langchain_messages, system_prompt)
        """
        langchain_messages = []
        
        construct = None
        try:
            construct = await get_construct_by_id(db, construct_id)
        except Exception as e:
            print(f"Error fetching construct {construct_id}: {e}")
        
   
        system_prompt = None
        try:
    
            custom_instructions = None
            system_msg_index = 0
            if chat_messages and chat_messages[0].role == "system":
                custom_instructions = chat_messages[0].content
                system_msg_index = 1
            
            system_prompt = template_service.render_system_prompt(
                mode=mode,
                construct=construct,
                construct_id=str(construct_id),
                custom_instructions=custom_instructions
            )
        except Exception as e:
            print(f"⚠️ Error generating system prompt: {e}")
            system_prompt = template_service.render_system_prompt(mode=mode)
        
        conversation_messages = chat_messages[system_msg_index:]
        
        for msg in conversation_messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content, name="User"))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content, name="Assistant"))
            else:
                print(f"⚠️ Unknown message role: {msg.role}")
    
        return langchain_messages, system_prompt
