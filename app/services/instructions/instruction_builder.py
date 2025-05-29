"""
Centralized instruction building with support for different modes and guardrails.
"""
from .instructions_loader import InstructionsLoader
from typing import Dict, Any, Optional


class InstructionBuilder:
    
    @staticmethod
    def build_comprehensive_system_instruction(mode: str = "chat") -> str:
        """Builds a full system instruction set combining core persona, mode behavior, and safety guardrails."""

        # Load instruction components
        mode_instruction = InstructionsLoader.load_mode_prompt(mode)
        guardrails = InstructionsLoader.load_guardrails()
        

        # Inject dynamic tokens into all instructions
        mode_instruction = InstructionsLoader.substitute_variables(mode_instruction)
        identity_instruction = InstructionsLoader.substitute_variables(guardrails["identity"])
        safety_instruction = InstructionsLoader.substitute_variables(guardrails["safety"])
        system_instruction = InstructionsLoader.substitute_variables(guardrails["system"])
        

        instruction_parts = []

        instruction_parts.append("=== CORE PERSONA ===")
        
        # Mode-specific behavior
        if mode_instruction:
            instruction_parts.append("\n=== INTERACTION MODE ===")
            instruction_parts.append(mode_instruction)
        
        # Guardrails
        if identity_instruction:
            instruction_parts.append("\n=== IDENTITY PROTECTION ===")
            instruction_parts.append(identity_instruction)
        
        if safety_instruction:
            instruction_parts.append("\n=== SAFETY BOUNDARIES ===")
            instruction_parts.append(safety_instruction)
        
        if system_instruction:
            instruction_parts.append("\n=== SYSTEM PROTECTION ===")
            instruction_parts.append(system_instruction)

        return "\n".join(instruction_parts)
