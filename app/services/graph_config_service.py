"""
Graph configuration presets for different chat scenarios.
Provides pre-configured graph setups for common use cases.
"""
from langchain_core.messages import AIMessage

from app.services.state_graph_service import state_graph_service
from app.models.construct import Construct
from app.services.template_service import template_service

class GraphConfigService:
    """Service providing pre-configured graph setups."""

    @staticmethod
    def create_construct_chat_graph(
        construct: "Construct",
        chat_mode: str = "chat",
        model_name: str = None,
    ):
        """Create a graph configured for a specific construct and chat mode."""
      
        model_name = model_name or construct.llm_model or "gemma3:27b"
        system_message = template_service.generate_system_prompt(
            construct=construct,
            mode=chat_mode
        )
        
        # Set temperature based on mode and construct preferences
        temperature = {
            "chat": construct.temperature or 0.7,
            "roleplay": max(construct.temperature or 0.8, 0.8),
            "assist": min(construct.temperature or 0.3, 0.3),
            "journal": max(construct.temperature or 0.9, 0.9),
            "story": max(construct.temperature or 0.8, 0.8),
            "silent": max(construct.temperature or 0.1, 0.1),
        }.get(chat_mode, construct.temperature or 0.7)
        
        llm_chain = state_graph_service.create_llm_chain(
            model_name=model_name,
            system_message=system_message,
            temperature=temperature,
            top_p=construct.top_p,
            repeat_penalty=construct.repeat_penalty
        )
        
        return state_graph_service.create_chat_graph(llm_chain=llm_chain)

    @staticmethod
    def create_multi_step_graph(model_name: str = "gemma3:27b"):
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
            llm_chain = state_graph_service.create_llm_chain(
                model_name=model_name,
                system_message="You are an AI that provides detailed, step-by-step reasoning."
            )
            
            messages = state["messages"]
            response = llm_chain.invoke({"messages": messages})
            
            return {"messages": [response]}
        
        def conclusion_node(state):
            """Node for final conclusion."""
            llm_chain = state_graph_service.create_llm_chain(
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
        
        return state_graph_service.create_multi_node_graph(
            nodes=nodes,
            edges=edges,
            start_node="thinking",
            end_nodes=["conclusion"]
        )
    


# Global config service instance
graph_config_service = GraphConfigService()
