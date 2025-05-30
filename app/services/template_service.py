"""
Template service for rendering Jinja2 templates for prompts and instructions.
"""
import json
from typing import Optional, Dict
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path
import threading

from app.models.construct import Construct


class TemplateService:
    """Service for rendering Jinja2 templates."""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):

        templates_dir = Path(__file__).parent.parent / "templates"

        self.instructions_dir = Path(__file__).parent.parent / "instructions"
        self.env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=select_autoescape(['html', 'xml']),
            trim_blocks=True,
            lstrip_blocks=True
        )
        
        self.env.filters['tojson'] = self._to_json_filter
        self.env.globals['load_guardrails'] = self._load_guardrails
        self.env.globals['load_instruction_file'] = self._load_instruction_file
        

        self._file_cache: Dict[str, str] = {}
        self._cache_lock = threading.Lock()
        
    def _to_json_filter(self, obj, indent: int = None) -> str:
        """Custom JSON filter for templates."""
        return json.dumps(obj, indent=indent, default=str)
    
    def _load_instruction_file(self, filepath: str) -> str:
        """
        Load an instruction file and cache its contents.
        
        Args:
            filepath: Relative path from the instructions directory
        
        Returns:
            Content of the file
        """
        with self._cache_lock:
            if filepath in self._file_cache:
                return self._file_cache[filepath]
        
        full_path = self.instructions_dir / filepath
        try:
            with open(full_path, 'r', encoding='utf-8') as file:
                content = file.read()
                with self._cache_lock:
                    self._file_cache[filepath] = content
                    return content
        except FileNotFoundError:
            return f"<!-- File not found: {filepath} -->"
        except Exception as e:
            return f"<!-- Error loading file {filepath}: {str(e)} -->"
        
    def _load_guardrails(self, guardrail_type: str, **replacements) -> str:
        """
        Load a specific guardrail file and apply variable replacements.
        
        Args:
            guardrail_type: Type of guardrail ('identity', 'safety', 'system')
            **replacements: Additional variable replacements
        
        Returns:
            Content of the guardrail file with variables replaced
        """
        valid_types = {'identity', 'safety', 'system'}
        if guardrail_type not in valid_types:
            return f"<!-- Invalid guardrail type: {guardrail_type}. Valid types: {', '.join(valid_types)} -->"
        
        filepath = f"chat/guardrails/{guardrail_type}_guardrails.txt"
        content = self._load_instruction_file(filepath)
        
        for key, value in replacements.items():
            placeholder = f"{{{key}}}"
            content = content.replace(placeholder, str(value))
        
        return content
    
    def render_system_prompt(
        self,
        mode: str = "chat",
        construct: Optional[Construct] = None,
        construct_id: Optional[str] = None,
        custom_instructions: Optional[str] = None,
        **kwargs
    ) -> str:
        """
        Render the system prompt template.
        
        Args:
            mode: The mode for the agent (default: "chat_mode")
            construct: The construct object if available
            construct_id: The construct ID if construct is not available
            custom_instructions: Additional custom instructions
            **kwargs: Additional template variables
        
        Returns:
            Rendered system prompt string
        """
        template = self.env.get_template("prompts/agent_mode.j2")
        
        context = {
            "mode": mode,
            "construct": construct,
            "construct_id": construct_id,
            "custom_instructions": custom_instructions,
            **kwargs
        }
        
        return template.render(**context)
    
    def render_template(self, template_name: str, **context) -> str:
        """
        Render any template with the given context.
        
        Args:
            template_name: Name of the template file
            **context: Template variables
        
        Returns:
            Rendered template string
        """
        template = self.env.get_template(template_name)
        return template.render(**context)



template_service = TemplateService()
