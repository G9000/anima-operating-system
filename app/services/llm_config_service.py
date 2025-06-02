"""
Centralized LLM configuration service.
Provides unified temperature management, model configuration, mode-aware settings,
and LLM chain creation. Eliminates duplication across chat nodes and graph services.
"""
from typing import Dict, Any, Optional
from dataclasses import dataclass
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder


@dataclass
class LLMConfig:
    """Configuration class for LLM settings."""
    model_name: str
    temperature: float
    top_p: Optional[float] = None
    repeat_penalty: Optional[float] = None
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    base_url: str = "http://localhost:11434"

    def to_model_kwargs(self) -> Dict[str, Any]:
        """Convert to kwargs for model initialization."""
        kwargs = {"temperature": self.temperature}
        
        if self.top_p is not None:
            kwargs["top_p"] = self.top_p
        if self.repeat_penalty is not None:
            kwargs["repeat_penalty"] = self.repeat_penalty
        if self.presence_penalty is not None:
            kwargs["presence_penalty"] = self.presence_penalty
        if self.frequency_penalty is not None:
            kwargs["frequency_penalty"] = self.frequency_penalty
            
        return kwargs

class LLMConfigService:
    """Centralized service for LLM configuration management."""
    
    # Mode-specific temperature defaults
    MODE_TEMPERATURES = {
        "chat": 0.7,
        "roleplay": 0.8,
        "assist": 0.3,
        "journal": 0.9,
        "story": 0.8,
        "silent": 0.1
    }
    
    # Mode-specific behavior modifiers
    MODE_MODIFIERS = {
        "roleplay": {"min_temperature": 0.8},
        "assist": {"max_temperature": 0.3},
        "journal": {"min_temperature": 0.9},
        "story": {"min_temperature": 0.8},
        "silent": {"max_temperature": 0.1}
    }
    

    @classmethod
    def create_basic_config(
        cls,
        model_name: str = "gemma3:27b",
        mode: str = "chat",
        temperature: Optional[float] = None,
        **kwargs
    ) -> LLMConfig:
        """
        Create basic LLM configuration without construct.
        
        Args:
            model_name: Model to use
            mode: Chat mode
            temperature: Override temperature
            **kwargs: Additional model parameters
            
        Returns:
            LLMConfig instance
        """
        final_temperature = temperature or cls.get_mode_temperature(mode)
        
        return LLMConfig(
            model_name=model_name,
            temperature=final_temperature,
            **kwargs
        )
    
    @classmethod
    def get_streaming_config(cls, mode: str) -> Dict[str, Any]:
        """Get streaming-specific configuration for a mode."""
        streaming_configs = {
            "chat": {"chunk_size": 1024},
            "roleplay": {"chunk_size": 512, "delay_ms": 50},
            "assist": {"chunk_size": 2048},
            "journal": {"chunk_size": 512, "delay_ms": 100},
            "story": {"chunk_size": 256, "delay_ms": 75},
            "silent": {"chunk_size": 4096}
        }
        
        return streaming_configs.get(mode, {"chunk_size": 1024})
    
    @classmethod
    def validate_config(cls, config: LLMConfig) -> tuple[bool, str]:
        """
        Validate LLM configuration.
        
        Args:
            config: Configuration to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not config.model_name:
            return False, "Model name is required"
        
        if not 0.0 <= config.temperature <= 2.0:
            return False, "Temperature must be between 0.0 and 2.0"
        
        if config.top_p is not None and not 0.0 <= config.top_p <= 1.0:
            return False, "top_p must be between 0.0 and 1.0"
        
        return True, ""
    
    @classmethod
    def create_llm_chain(
        cls,
        config: Optional[LLMConfig] = None,
        model_name: str = "gemma3:27b",
        mode: str = "chat",
        system_message: str = "You are Anima OS, a helpful AI assistant.",
        **model_kwargs
    ):
        """
        Create an LLM chain with the specified configuration.
        
        Args:
            config: LLMConfig object with model settings (preferred)
            model_name: Name of the model (fallback)
            mode: Chat mode for temperature calculation (fallback)
            system_message: System message for the prompt
            **model_kwargs: Additional model parameters (fallback)
        
        Returns:
            LangChain LLM chain (prompt_template | llm)
        """
        # Use provided config or create a basic one
        if config:
            # Validate the provided config
            is_valid, error_msg = cls.validate_config(config)
            if not is_valid:
                raise ValueError(f"Invalid LLM configuration: {error_msg}")
                
            final_config = config
        else:
            # Create basic config from parameters
            final_config = cls.create_basic_config(
                model_name=model_name,
                mode=mode,
                **model_kwargs
            )
        
        # Create the LLM instance
        llm = ChatOllama(
            model=final_config.model_name,
            base_url=final_config.base_url,
            **final_config.to_model_kwargs()
        )
        
        # Create the prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder("messages")
        ])
        
        # Return the chain (prompt | llm)
        return prompt_template | llm

# Global config service instance
llm_config_service = LLMConfigService()

