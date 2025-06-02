"""
LLM processing node service.
Handles the core LLM processing with mode-aware configuration.
"""

from typing import Dict, Any
from .base_node import BaseChatNode
from app.services.chat_service import ChatState
from app.services.llm_config_service import llm_config_service


class LLMProcessingNode(BaseChatNode):
    """Node for processing messages through LLM with mode-aware configuration."""
    
    async def process(self, state: ChatState) -> Dict[str, Any]:
        """Process messages through LLM with mode-aware configuration."""
        try:
            self._log_processing_start("LLM processing")
            
            request_data = state["request_data"]
            messages = state.get("messages", [])
            mode = state.get("mode", "chat")
            

            config = llm_config_service.create_basic_config(
                model_name=request_data["model"],
                mode=mode,
                temperature=request_data.get("temperature")
            )
            
        
            is_valid, error_msg = llm_config_service.validate_config(config)
            if not is_valid:
                return self._handle_error(ValueError(f"Invalid LLM config: {error_msg}"))
            

            llm_chain = llm_config_service.create_llm_chain(
                config=config,
                system_message=""
            )
            
            self.logger.info(f"Processing with model: {config.model_name}, mode: {mode}, temp: {config.temperature}")
            
            response = await llm_chain.ainvoke({"messages": messages})
            
            response_content = response.content if hasattr(response, 'content') else str(response)
            
            result = {
                "response_content": response_content,
                "messages": [response] 
            }
            
            self._log_processing_complete(f"response length: {len(response_content)} chars")
            return result
            
        except Exception as e:
            return self._handle_error(e, "LLM processing")
