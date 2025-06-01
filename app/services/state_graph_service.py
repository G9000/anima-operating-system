"""
Simple graph service for creating and managing LangGraph state graphs.
Decoupled from the chat service for better separation of concerns.
"""
from typing import Annotated, List, Callable, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage, AIMessage
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

class SimpleState(TypedDict):
    """State definition for the simple chat graph."""
    messages: Annotated[List[BaseMessage], add_messages]

class StateGraphService:
    """Service for creating and managing LangGraph state graphs."""
    
    def __init__(self):
        self.memory_saver = MemorySaver()
    
    def create_chat_graph(
        self, 
        llm_chain,
        message_trimmer: Optional[Callable] = None,
        error_handler: Optional[Callable] = None,
        max_retries: int = 1
    ):
        """
        Create a chat graph with the provided LLM chain and configuration.
        
        Args:
            llm_chain: The LangChain LLM chain to use for responses
            system_message: System message for the chatbot
            message_trimmer: Optional function to trim messages for context window
            error_handler: Optional custom error handler function
            max_retries: Maximum number of retry attempts on error
        
        Returns:
            Compiled LangGraph with memory support
        """
        def chatbot_node(state: SimpleState):
            """Main chatbot processing node."""
            for attempt in range(max_retries + 1):
                try:
                    messages = state["messages"]
                    
                    # Apply message trimming if provided
                    if message_trimmer:
                        messages = message_trimmer(messages)
                    
                    # Invoke the LLM chain
                    response = llm_chain.invoke({"messages": messages})
                    
                    return {"messages": [response]}
                    
                except Exception as e:
                    if attempt < max_retries:
                        print(f"⚠️ Attempt {attempt + 1} failed: {e}, retrying...")
                        continue
                    
                    print(f"❌ Error in chatbot node: {e}")
                    
                    # Use custom error handler if provided
                    if error_handler:
                        return error_handler(state, e)
                    
                    # Default error message
                    error_msg = AIMessage(content=f"Sorry, I encountered an error: {str(e)}")
                    return {"messages": [error_msg]}
        
        # Create the graph
        graph_builder = StateGraph(SimpleState)
        graph_builder.add_node("chatbot", chatbot_node)
        graph_builder.add_edge(START, "chatbot")
        graph_builder.add_edge("chatbot", END)
        
        # Compile with memory
        return graph_builder.compile(checkpointer=self.memory_saver)
    
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
        
        return graph_builder.compile(checkpointer=self.memory_saver)
    
    def create_llm_chain(
        self,
        model_name: str = "gemma3:27b",
        base_url: str = "http://localhost:11434",
        system_message: str = "You are Anima OS, a helpful AI assistant.",
        **model_kwargs
    ):
        """
        Create an LLM chain with the specified configuration.
        
        Args:
            model_name: Name of the model
            base_url: Base URL for LLM service
            system_message: System message for the prompt
            **model_kwargs: Additional model parameters
        
        Returns:
            LangChain LLM chain
        """
        # Initialize Ollama model
        llm = ChatOllama(
            model=model_name,
            base_url=base_url,
            **model_kwargs
        )
        
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder("messages")
        ])
        
        return prompt_template | llm
    
    def get_memory_saver(self):
        """Get the memory saver instance."""
        return self.memory_saver
    
    def clear_memory(self, thread_id: str = None):
        """
        Clear memory for a specific thread or all threads.
        
        Args:
            thread_id: Specific thread to clear, or None to clear all
        """
        if thread_id:
            # Clear specific thread (if memory saver supports it)
            if hasattr(self.memory_saver, 'clear_thread'):
                self.memory_saver.clear_thread(thread_id)
            else:
                print(f"⚠️ Memory saver doesn't support thread-specific clearing")
        else:
            # Clear all memory
            self.memory_saver = MemorySaver()
            print("🧹 All memory cleared")
    
    def validate_graph(self, graph):
        """Validate that a graph is properly configured."""
        try:
            # Test with empty state
            test_state = {"messages": []}
            config = {"configurable": {"thread_id": "test"}}
            
            # Attempt to get initial state
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


# Global graph service instance
state_graph_service = StateGraphService()
