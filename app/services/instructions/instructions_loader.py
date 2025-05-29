"""
Utility class for loading instruction files and managing variables.
"""
from pathlib import Path
from typing import Dict


INSTRUCTIONS_DIR = Path(__file__).parent.parent.parent / "instructions" / "chat"


class InstructionsLoader:
    """Utility class for loading and managing instructions."""
    
    @staticmethod
    def load_instructions_file(file_path: Path) -> str:
        """Load a instructions file and return its content."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:            return f.read().strip()
        except FileNotFoundError:
            return ""
    
    @staticmethod
    def load_mode_prompt(mode: str) -> str:
        """Load the prompt for a specific mode."""
        mode_file = INSTRUCTIONS_DIR / "modes" / f"{mode}_mode.txt"
        return InstructionsLoader.load_instructions_file(mode_file)
    
    @staticmethod
    def load_guardrails() -> Dict[str, str]:
        """Load all guardrail instructions."""
        guardrails_dir = INSTRUCTIONS_DIR / "guardrails"
        return {
            "identity": InstructionsLoader.load_instructions_file(guardrails_dir / "identity_guardrails.txt"),
            "safety": InstructionsLoader.load_instructions_file(guardrails_dir / "safety_guardrails.txt"),
            "system": InstructionsLoader.load_instructions_file(guardrails_dir / "system_guardrails.txt")
        }
    
    @staticmethod
    def substitute_variables(prompt: str, construct_name: str = "Anima OS", 
                           pronoun_subject: str = "she", pronoun_object: str = "her") -> str:
        """Substitute variables in prompt text."""
        return prompt.replace("{CONSTRUCT_NAME}", construct_name) \
                    .replace("{PRONOUN_SUBJECT}", pronoun_subject) \
                    .replace("{PRONOUN_OBJECT}", pronoun_object)
