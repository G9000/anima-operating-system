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

class SimpleGraphService:
    """Service for creating and managing LangGraph state graphs."""
    
    def __init__(self):
        self.memory_saver = MemorySaver()
    
    def create_chat_graph(
        self, 
        llm_chain,
        system_message: str = "You are a helpful AI assistant. You are friendly, knowledgeable, and always try to be helpful.",
        message_trimmer: Optional[Callable] = None
    ):
        """
        Create a chat graph with the provided LLM chain and configuration.
        
        Args:
            llm_chain: The LangChain LLM chain to use for responses
            system_message: System message for the chatbot
            message_trimmer: Optional function to trim messages for context window
        
        Returns:
            Compiled LangGraph with memory support
        """
        def chatbot_node(state: SimpleState):
            """Main chatbot processing node."""
            try:
                messages = state["messages"]
                
                # Apply message trimming if provided
                if message_trimmer:
                    messages = message_trimmer(messages)
                
                # Invoke the LLM chain
                response = llm_chain.invoke({"messages": messages})
                
                return {"messages": [response]}
                
            except Exception as e:
                print(f"❌ Error in chatbot node: {e}")
                # Return error message
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
        model_name: str = "llama3.1",
        base_url: str = "http://localhost:11434",
        system_message: str = "You are a helpful AI assistant.",
        **model_kwargs
    ):
        """
        Create an LLM chain with the specified configuration.
        
        Args:
            model_name: Name of the Ollama model
            base_url: Base URL for Ollama
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
        
        # Create prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder("messages")
        ])
        
        # Create and return the chain
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


# Global graph service instance
simple_graph_service = SimpleGraphService()
