"""
Pydantic schemas for email configuration.
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime


class EmailConfigBase(BaseModel):
    """Base email configuration schema."""
    email_address: EmailStr
    imap_server: str
    imap_port: Optional[int] = 993
    use_ssl: Optional[bool] = True
    provider: Optional[str] = None
    display_name: Optional[str] = None


class EmailConfigCreate(EmailConfigBase):
    """Schema for creating email configuration."""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 1:
            raise ValueError('Password cannot be empty')
        return v


class EmailConfigUpdate(BaseModel):
    """Schema for updating email configuration."""
    email_address: Optional[EmailStr] = None
    password: Optional[str] = None
    imap_server: Optional[str] = None
    imap_port: Optional[int] = None
    use_ssl: Optional[bool] = None
    provider: Optional[str] = None
    display_name: Optional[str] = None
    is_active: Optional[bool] = None


class EmailConfigTest(EmailConfigBase):
    """Schema for testing email configuration."""
    password: str


class EmailConfigResponse(EmailConfigBase):
    """Schema for email configuration response."""
    id: str
    user_id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_used_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class EmailProvider(BaseModel):
    """Schema for email provider presets."""
    name: str
    display_name: str
    imap_server: str
    imap_port: int
    use_ssl: bool
    setup_instructions: str
