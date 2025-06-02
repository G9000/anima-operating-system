"""
Simple graph service for creating and managing LangGraph state graphs.
Decoupled from the chat service for better separation of concerns.
"""
from typing import Annotated, List, Callable, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage, AIMessage

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

from app.services.memory_service import memory_service
from app.services.llm_config_service import LLMConfig

class SimpleState(TypedDict):
    """State definition for the simple chat graph."""
    messages: Annotated[List[BaseMessage], add_messages]

class StateGraphService:
    """Service for creating and managing LangGraph state graphs."""
    
    def __init__(self):
        pass
    
    def create_multi_node_graph(
        self,
        nodes: dict,
        edges: list,
        start_node: str,
        end_nodes: list = None
    ):
        """
        Create a more complex graph with multiple nodes.
        
        Args:
            nodes: Dictionary of {node_name: node_function}
            edges: List of tuples [(from_node, to_node), ...]
            start_node: Name of the starting node
            end_nodes: List of ending nodes (defaults to END)
        
        Returns:
            Compiled LangGraph with memory support
        """
        if end_nodes is None:
            end_nodes = [END]
        
        graph_builder = StateGraph(SimpleState)
        
        # Add all nodes
        for node_name, node_function in nodes.items():
            graph_builder.add_node(node_name, node_function)
        
        # Add start edge
        graph_builder.add_edge(START, start_node)
        
        # Add custom edges
        for from_node, to_node in edges:
            graph_builder.add_edge(from_node, to_node)
        
        # Add end edges
        for end_node in end_nodes:
            if end_node != END:
                        graph_builder.add_edge(end_node, END)
        
        return graph_builder.compile(checkpointer=memory_service.memory_saver)
  
    
    def validate_graph(self, graph):
        """Validate that a graph is properly configured."""
        try:
            config = {"configurable": {"thread_id": "test"}}
            
            graph.get_state(config)
            
            return True, "Graph validation successful"
        except Exception as e:
            return False, f"Graph validation failed: {str(e)}"
    
    def create_message_trimmer(self, max_messages: int = 20, preserve_system: bool = True):
        """Create a message trimmer function for context window management."""
        def trim_messages(messages: List[BaseMessage]) -> List[BaseMessage]:
            if len(messages) <= max_messages:
                return messages
            
            # Preserve system message if requested
            if preserve_system and messages and messages[0].type == "system":
                return [messages[0]] + messages[-(max_messages-1):]
            
            return messages[-max_messages:]
        
        return trim_messages
    
    def create_chat_graph(self, chat_state_class):
        """
        Create a chat graph using dedicated chat nodes.
        
        Args:
            chat_state_class: The ChatState TypedDict class from chat_service
        
        Returns:
            Compiled LangGraph with memory support using the full chat pipeline
        """
        from app.services.chat_nodes import (
            ContextPreparationNode,
            SystemPromptInjectionNode,
            LLMProcessingNode,
            ResponseFormattingNode
        )
        
        # Initialize node instances
        context_node = ContextPreparationNode()
        system_prompt_node = SystemPromptInjectionNode()
        llm_node = LLMProcessingNode()
        response_node = ResponseFormattingNode()
        
        # Build the graph
        graph_builder = StateGraph(chat_state_class)
        
        # Add nodes using dedicated node classes
        graph_builder.add_node("context_preparation", context_node.process)
        graph_builder.add_node("system_prompt_injection", system_prompt_node.process)
        graph_builder.add_node("llm_processing", llm_node.process)
        graph_builder.add_node("response_formatting", response_node.process)
        
        # Add edges for the chat pipeline
        graph_builder.add_edge(START, "context_preparation")
        graph_builder.add_edge("context_preparation", "system_prompt_injection")
        graph_builder.add_edge("system_prompt_injection", "llm_processing")
        graph_builder.add_edge("llm_processing", "response_formatting")
        graph_builder.add_edge("response_formatting", END)
        

        return graph_builder.compile(checkpointer=memory_service.memory_saver)
    

# Global graph service instance
state_graph_service = StateGraphService()
