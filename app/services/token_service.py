"""
Token estimation utilities for chat processing.
Provides consistent token counting across the application.
"""

import logging
from typing import Union, List, Any


class TokenEstimationService:
    """Service for estimating token counts in various content types."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Rough approximation: 1 token ≈ 1.3 words for English text
        self.word_to_token_ratio = 1.3
    
    def estimate_tokens(self, content: Union[str, List, Any]) -> int:
        """
        Rough token estimation for usage tracking.
        
        Args:
            content: Content to estimate tokens for (string, list of messages, etc.)
            
        Returns:
            Estimated token count
        """
        try:
            if isinstance(content, list):
                total = 0
                for item in content:
                    if hasattr(item, 'content'):
                        total += self._count_text_tokens(str(item.content))
                    else:
                        total += self._count_text_tokens(str(item))
                return total
            elif hasattr(content, 'content'):
                return self._count_text_tokens(str(content.content))
            else:
                return self._count_text_tokens(str(content))
        except Exception as e:
            self.logger.warning(f"Error estimating tokens, using fallback: {e}")
            return len(str(content)) // 4  # Very rough fallback
    
    def _count_text_tokens(self, text: str) -> int:
        """Count tokens in a text string."""
        if not text:
            return 0
        
        # Simple word-based estimation
        word_count = len(text.split())
        token_count = int(word_count * self.word_to_token_ratio)
        
        # Add some tokens for special characters and formatting
        special_char_bonus = len([c for c in text if not c.isalnum() and not c.isspace()]) // 10
        
        return max(1, token_count + special_char_bonus)
    
    def estimate_prompt_tokens(self, messages: List[Any]) -> int:
        """Estimate tokens for prompt messages specifically."""
        return self.estimate_tokens(messages)
    
    def estimate_completion_tokens(self, response: Union[str, Any]) -> int:
        """Estimate tokens for completion response specifically."""
        return self.estimate_tokens(response)
    
    def estimate_total_tokens(self, prompt_tokens: int, completion_tokens: int) -> int:
        """Calculate total tokens from prompt and completion counts."""
        return prompt_tokens + completion_tokens


# Global instance
token_service = TokenEstimationService()
