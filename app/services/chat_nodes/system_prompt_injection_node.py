"""
System prompt injection node service.
Handles injection of system prompts based on mode and construct data.
"""

from typing import Dict, Any
from langchain_core.messages import SystemMessage
from .base_node import BaseChatNode
from app.services.chat_service import ChatState


class SystemPromptInjectionNode(BaseChatNode):
    """Node for injecting system prompts based on mode and construct."""
    
    async def process(self, state: ChatState) -> Dict[str, Any]:
        """Inject system prompt based on mode and construct."""
        try:
            self._log_processing_start("system prompt injection")
            
            system_prompt = state.get("system_prompt")
            messages = state.get("messages", [])
            
            # Check if there's already a system message in the conversation
            has_system_message = any(isinstance(msg, SystemMessage) for msg in messages)
            
            if system_prompt and not has_system_message:
                system_message = SystemMessage(content=system_prompt)
                messages = [system_message] + messages
                self.logger.debug("System prompt injected successfully")
            elif has_system_message:
                self.logger.debug("System message already exists, skipping injection")
            else:
                self.logger.warning("No system prompt to inject")
            
            result = {"messages": messages}
            self._log_processing_complete(f"messages count: {len(messages)}")
            return result
            
        except Exception as e:
            return self._handle_error(e, "system prompt injection")
