"""
Simple chat router implementation based on the chatbot_langgraph_fastapi example.
Minimal implementation for testing and experimentation.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage

from app.services.simple_chat_service import SimpleChatService
from app.services.graph_config_service import graph_config_service

router = APIRouter(prefix="/simple")

class SimpleChatInput(BaseModel):
    messages: List[str]
    thread_id: str

# Initialize the simple chat service
simple_chat_service = SimpleChatService()

@router.post("/chat")
async def simple_chat(input: SimpleChatInput):
    """Simple chat endpoint similar to the reference implementation."""
    try:
        config = {"configurable": {"thread_id": input.thread_id}}
        
        # Convert string messages to LangChain format
        langchain_messages = [HumanMessage(content=msg) for msg in input.messages]
        
        response = await simple_chat_service.graph.ainvoke(
            {"messages": langchain_messages}, 
            config=config
        )
        
        return {
            "response": response["messages"][-1].content,
            "thread_id": input.thread_id
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "thread_id": input.thread_id
        }


@router.get("/configs")
async def get_available_configs():
    """Get available graph configurations."""
    return {
        "configs": graph_config_service.get_available_configs(),
        "current_model": "gemma3:27b"  # This could be dynamic
    }

@router.post("/switch-config")
async def switch_graph_config(config_type: str, model_name: str = "llama3.1"):
    """Switch to a different graph configuration."""
    try:
        if config_type == "basic":
            new_graph = graph_config_service.create_basic_chat_graph(model_name)
        elif config_type == "roleplay":
            new_graph = graph_config_service.create_roleplay_chat_graph(model_name)
        elif config_type == "assistant":
            new_graph = graph_config_service.create_assistant_chat_graph(model_name)
        elif config_type == "creative":
            new_graph = graph_config_service.create_creative_chat_graph(model_name)
        elif config_type == "multi_step":
            new_graph = graph_config_service.create_multi_step_graph(model_name)
        else:
            return {"error": f"Unknown config type: {config_type}"}
        
        # Update the simple chat service graph
        simple_chat_service.graph = new_graph
        
        return {
            "message": f"Switched to {config_type} configuration with model {model_name}",
            "config_type": config_type,
            "model_name": model_name
        }
        
    except Exception as e:
        return {"error": str(e)}
