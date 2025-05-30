from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class ConstructCreateRequest(BaseModel):
    name: str = "New Construct"
    data: Optional[Dict[str, Any]] = {}

class ConstructUpdateRequest(BaseModel):
    name: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class ConstructResponse(BaseModel):
    id: uuid.UUID
    name: str
    data: Optional[Dict[str, Any]] = {}
    creator_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Legacy models for backward compatibility
class ConstructRequest(BaseModel):
    user_id: uuid.UUID