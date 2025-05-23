from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
import uuid
from app.db.database import Base


class Persona(Base):
    __tablename__ = "personas"
    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    schema_version = Column(String, nullable=False)
    name = Column(String, nullable=False)
    data = Column(JSONB)
    creator_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),
                        onupdate=func.now(), default=func.now())