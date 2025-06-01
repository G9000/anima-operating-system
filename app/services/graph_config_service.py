"""
Graph configuration presets for different chat scenarios.
Provides pre-configured graph setups for common use cases.
"""
from typing import List, Dict, Any
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage

from app.services.simple_graph_service import simple_graph_service

class GraphConfigService:
    """Service providing pre-configured graph setups."""
    
    @staticmethod
    def create_basic_chat_graph(model_name: str = "llama3.1"):
        """Create a basic chat graph with standard configuration."""
        llm_chain = simple_graph_service.create_llm_chain(
            model_name=model_name,
            system_message="You are a helpful AI assistant."
        )
        
        return simple_graph_service.create_chat_graph(llm_chain=llm_chain)
    
    @staticmethod
    def create_roleplay_chat_graph(
        model_name: str = "llama3.1",
        character_prompt: str = "You are a friendly character in a roleplay scenario."
    ):
        """Create a roleplay-focused chat graph."""
        llm_chain = simple_graph_service.create_llm_chain(
            model_name=model_name,
            system_message=character_prompt,
            temperature=0.8  # Higher creativity for roleplay
        )
        
        return simple_graph_service.create_chat_graph(llm_chain=llm_chain)
    
    @staticmethod
    def create_assistant_chat_graph(
        model_name: str = "llama3.1",
        task_focus: str = "general assistance"
    ):
        """Create a task-focused assistant graph."""
        system_prompt = f"""You are a helpful AI assistant focused on {task_focus}. 
        You are direct, efficient, and provide practical solutions."""
        
        llm_chain = simple_graph_service.create_llm_chain(
            model_name=model_name,
            system_message=system_prompt,
            temperature=0.3  # Lower temperature for more focused responses
        )
        
        return simple_graph_service.create_chat_graph(llm_chain=llm_chain)
    
    @staticmethod
    def create_creative_chat_graph(
        model_name: str = "llama3.1",
        creative_focus: str = "storytelling"
    ):
        """Create a creativity-focused chat graph."""
        system_prompt = f"""You are a creative AI assistant specializing in {creative_focus}. 
        You are imaginative, expressive, and help users explore creative ideas."""
        
        llm_chain = simple_graph_service.create_llm_chain(
            model_name=model_name,
            system_message=system_prompt,
            temperature=0.9  # High creativity
        )
        
        return simple_graph_service.create_chat_graph(llm_chain=llm_chain)
    
    @staticmethod
    def create_multi_step_graph(model_name: str = "llama3.1"):
        """Create a multi-step reasoning graph."""
        
        def thinking_node(state):
            """Node for thinking through the problem."""
            messages = state["messages"]
            
            # Add thinking prompt
            thinking_prompt = "Let me think through this step by step..."
            thinking_msg = AIMessage(content=thinking_prompt)
            
            return {"messages": [thinking_msg]}
        
        def reasoning_node(state):
            """Node for detailed reasoning."""
            llm_chain = simple_graph_service.create_llm_chain(
                model_name=model_name,
                system_message="You are an AI that provides detailed, step-by-step reasoning."
            )
            
            messages = state["messages"]
            response = llm_chain.invoke({"messages": messages})
            
            return {"messages": [response]}
        
        def conclusion_node(state):
            """Node for final conclusion."""
            llm_chain = simple_graph_service.create_llm_chain(
                model_name=model_name,
                system_message="Provide a clear, concise conclusion based on the reasoning above."
            )
            
            messages = state["messages"]
            response = llm_chain.invoke({"messages": messages})
            
            return {"messages": [response]}
        
        nodes = {
            "thinking": thinking_node,
            "reasoning": reasoning_node,
            "conclusion": conclusion_node
        }
        
        edges = [
            ("thinking", "reasoning"),
            ("reasoning", "conclusion")
        ]
        
        return simple_graph_service.create_multi_node_graph(
            nodes=nodes,
            edges=edges,
            start_node="thinking",
            end_nodes=["conclusion"]
        )
    
    @staticmethod
    def get_available_configs() -> Dict[str, str]:
        """Get list of available graph configurations."""
        return {
            "basic": "Standard chat assistant",
            "roleplay": "Character roleplay with higher creativity",
            "assistant": "Task-focused assistant with lower temperature",
            "creative": "Creative writing and ideation",
            "multi_step": "Multi-step reasoning graph"
        }


# Global config service instance
graph_config_service = GraphConfigService()
