"""
LLM processing node service.
Handles the core LLM processing with mode-aware configuration.
"""

from typing import Dict, Any
from .base_node import BaseChatNode
from app.services.chat_service import ChatState
from app.services.state_graph_service import state_graph_service


class LLMProcessingNode(BaseChatNode):
    """Node for processing messages through LLM with mode-aware configuration."""
    
    def _get_mode_temperature(self, mode: str) -> float:
        """Get temperature setting based on chat mode."""
        temperature_map = {
            "chat": 0.7,
            "roleplay": 0.8,
            "assist": 0.3,
            "journal": 0.9,
            "story": 0.8,
            "silent": 0.1
        }
        return temperature_map.get(mode, 0.7)
    
    async def process(self, state: ChatState) -> Dict[str, Any]:
        """Process messages through LLM with mode-aware configuration."""
        try:
            self._log_processing_start("LLM processing")
            
            request_data = state["request_data"]
            messages = state.get("messages", [])
            mode = state.get("mode", "chat")
        
            model_kwargs = {
                "temperature": request_data.get("temperature") or self._get_mode_temperature(mode),
            }
            
            llm_chain = state_graph_service.create_llm_chain(
                model_name=request_data["model"],
                system_message="",                    
                **model_kwargs
            )
            
            self.logger.info(f"Processing with model: {request_data['model']}, mode: {mode}")
            
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
