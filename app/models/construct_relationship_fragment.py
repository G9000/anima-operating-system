from sqlalchemy import Column, DateTime, ForeignKey, String, func, Index
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.database import Base

class ConstructRelationshipFragment(Base):
    __tablename__ = "construct_relationship_fragments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    construct_link_id = Column(UUID(as_uuid=True), ForeignKey("construct_links.id"), nullable=False)
    context_tag = Column(String, nullable=True)
    data = Column(JSONB, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())

    construct_link = relationship("ConstructLink", backref="fragments")

    __table_args__ = (
        Index('idx_fragments_construct_link', 'construct_link_id'),
    )