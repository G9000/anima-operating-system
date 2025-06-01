"""
Simple chat service implementation based on the chatbot_langgraph_fastapi example.
Provides a minimal LangGraph implementation for testing and experimentation.
Uses the decoupled SimpleGraphService for graph management.
"""
from typing import List
from langchain_core.messages import BaseMessage, HumanMessage

from app.services.simple_graph_service import simple_graph_service

"""
Simple chat service implementation based on the chatbot_langgraph_fastapi example.
Provides a minimal LangGraph implementation for testing and experimentation.
Uses the decoupled SimpleGraphService for graph management.
"""
from typing import List
from langchain_core.messages import BaseMessage, HumanMessage

from app.services.simple_graph_service import simple_graph_service

class SimpleChatService:
    """Simple chat service using decoupled graph service."""
    
    def __init__(self):
        self.llm_chain = None
        self.graph = None
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize the LLM chain and graph using the graph service."""
        try:
            # Create LLM chain using the graph service
            self.llm_chain = simple_graph_service.create_llm_chain(
                model_name="gemma3:27b",
                system_message="You are a helpful AI assistant. You are friendly, knowledgeable, and always try to be helpful."
            )
            
            # Create the graph using the graph service
            self.graph = simple_graph_service.create_chat_graph(
                llm_chain=self.llm_chain,
                message_trimmer=self._trim_messages
            )
            
            print("✅ Simple chat service initialized successfully")
            
        except Exception as e:
            print(f"❌ Failed to initialize simple chat service: {e}")
            raise
    
    def _trim_messages(self, messages: List[BaseMessage], max_tokens: int = 4000) -> List[BaseMessage]:
        """
        Simple message trimming to fit context window.
        This is a basic implementation - in production you'd want more sophisticated trimming.
        """
        # For now, just keep the last N messages
        if len(messages) > 20:  # Simple limit
            # Keep system message if it exists, plus recent messages
            system_messages = [msg for msg in messages if hasattr(msg, 'type') and msg.type == 'system']
            recent_messages = messages[-19:]  # Keep last 19 messages
            return system_messages + recent_messages
        
        return messages
    
    def is_available(self) -> bool:
        """Check if the service is available."""
        return self.llm_chain is not None and self.graph is not None
    
    async def chat(self, messages: List[str], thread_id: str) -> str:
        """
        Simple chat method that takes string messages and returns a string response.
        """
        if not self.is_available():
            raise RuntimeError("Simple chat service is not available")
        
        try:
            # Convert string messages to LangChain format
            langchain_messages = [HumanMessage(content=msg) for msg in messages]
            
            config = {"configurable": {"thread_id": thread_id}}
            
            response = await self.graph.ainvoke(
                {"messages": langchain_messages}, 
                config=config
            )
            
            return response["messages"][-1].content
            
        except Exception as e:
            print(f"❌ Error in simple chat: {e}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    def clear_memory(self, thread_id: str = None):
        """Clear conversation memory."""
        simple_graph_service.clear_memory(thread_id)
    
    def recreate_with_different_model(self, model_name: str):
        """Recreate the service with a different model."""
        try:
            self.llm_chain = simple_graph_service.create_llm_chain(
                model_name=model_name,
                system_message="You are a helpful AI assistant. You are friendly, knowledgeable, and always try to be helpful."
            )
            
            self.graph = simple_graph_service.create_chat_graph(
                llm_chain=self.llm_chain,
                message_trimmer=self._trim_messages
            )
            
            print(f"✅ Simple chat service recreated with model: {model_name}")
            
        except Exception as e:
            print(f"❌ Failed to recreate simple chat service with {model_name}: {e}")
            raise


# Global instance (similar to the reference implementation)
simple_chat_service = SimpleChatService()
