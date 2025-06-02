"""
Construct repository for data access and business logic.
Handles construct data loading, transformation, and validation.
"""

import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.crud.construct import get_construct_by_id


class ConstructRepository:
    """Repository for construct data operations with business logic."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def get_construct_data(
        self, 
        construct_id: Optional[UUID], 
        db: AsyncSession
    ) -> Optional[Dict[str, Any]]:
        """Load and transform construct data from database."""
        if not construct_id:
            return None
            
        try:
            construct = await get_construct_by_id(db, construct_id)
            if not construct:
                self.logger.warning(f"Construct {construct_id} not found")
                return None
            
            construct_data = self._transform_construct_to_dict(construct)
            
            self.logger.info(f"Loaded construct: {construct_data.get('name')}")
            return construct_data
            
        except Exception as e:
            self.logger.warning(f"Error fetching construct {construct_id}: {e}")
            return None
    
    def _transform_construct_to_dict(self, construct) -> Dict[str, Any]:
        """Transform construct model to dictionary format."""
        if hasattr(construct, "model_dump"):
            return construct.model_dump()
        else:
            return {
                k: v for k, v in construct.__dict__.items() 
                if not k.startswith("_")
            }
    
    def validate_construct_data(self, construct_data: Optional[Dict[str, Any]]) -> bool:
        """Validate construct data structure."""
        if not construct_data:
            return True  # None is valid (no construct)
        
        required_fields = ["name"] 
        return all(field in construct_data for field in required_fields)
    
    async def get_construct(
        self,
        construct_id: Optional[UUID],
        db: AsyncSession
    ) -> Optional[Dict[str, Any]]:
        """
        Get construct data specifically formatted for chat operations.
        """
        construct_data = await self.get_construct_data(construct_id, db)
        
        if not construct_data:
            return None
        
        # Add chat-specific transformations here if needed
        # For example, preparing certain fields for prompt generation
        
        return construct_data


# Global instance
construct_repository = ConstructRepository()
