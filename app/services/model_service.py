"""
Model management service for handling Ollama models and LangChain integration.
"""
import json
from typing import Tuple, Optional
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver


checkpointer = InMemorySaver()

class ModelService:
    """Service for managing AI models and agent creation."""
    
    def __init__(self):
        self.ollama_model: Optional[ChatOllama] = None
        self.has_tool_support: bool = False
        self._initialize_model()
    
    def _initialize_model(self) -> None:
        """Initialize Ollama model with tool support."""
        self.ollama_model, self.has_tool_support = self._get_model_with_tool_support()
    
    def _get_model_with_tool_support(self) -> Tuple[Optional[ChatOllama], bool]:
        """Get a model that supports tool calling."""
        models_to_try = ["gemma3:27b", "llama4", "llama3.1", "llama3-groq-tool-use", "devstral:latest"]
        
        for model_name in models_to_try:
            try:
                model = ChatOllama(model=model_name, base_url="http://localhost:11434")
                test_tools = [{"type": "function", "function": {"name": "test", "description": "test"}}]
                try:
                    model.bind_tools(test_tools)
                    print(f"Connected to Ollama with {model_name} (tool-capable)")
                    return model, True
                except NotImplementedError:
                    print(f"{model_name} doesn't support tool binding, trying next model...")
                    continue
                except Exception as e:
                    print(f"Tool binding test failed for {model_name}: {e}")
                    return model, False
            except Exception as e:
                print(f"Failed to connect to {model_name}: {e}")
                continue
          # Fallback to basic model
        try:
            model = ChatOllama(model="gemma3:27b", base_url="http://localhost:11434")
            print("Using basic gemma3:27b without tool support")
            return model, False
        except Exception as e:
            print(f"Failed to connect to any model: {e}")
            return None, False
    
    def create_agent_executor(self, model_name: str = "devstral:latest"):
        """Create a react agent executor with tools."""
        if not self.is_available():
            raise RuntimeError("No model available. Please check Ollama is running.")
        
        try:
            model = ChatOllama(model=model_name, base_url="http://localhost:11434")
            
            # Debug: Verify checkpointer state and usage
            print(f"🧠 Creating agent with checkpointer: {type(checkpointer).__name__}")
            print(f"🔗 Checkpointer instance ID: {id(checkpointer)}")
            
            # Try to inspect internal storage if possible
            if hasattr(checkpointer, 'storage'):
                print(f"📚 Current stored threads: {list(checkpointer.storage.keys())}")
                print(f"📊 Total stored messages: {len(checkpointer.storage)}")
            else:
                print("📚 Checkpointer has no accessible storage attribute")
                
            # Try to inspect any internal state
            try:
                storage_data = vars(checkpointer)
                print(f"🔍 Checkpointer internal state keys: {list(storage_data.keys())}")
            except Exception as e:
                print(f"🔍 Cannot inspect checkpointer state: {e}")
            
            agent_executor = create_react_agent(
                model=model,
                tools=[],
                checkpointer=checkpointer
            )
            
            print(f"✅ Agent created successfully with memory support")
            return agent_executor
        except Exception as e:
            print(f"❌ Agent creation failed: {e}")
            raise
    
    def is_available(self) -> bool:
        """Check if a model is available."""
        return self.ollama_model is not None
    
    def get_model(self) -> Optional[ChatOllama]:
        """Get the current model instance."""
        return self.ollama_model


# Global model service instance
model_service = ModelService()
