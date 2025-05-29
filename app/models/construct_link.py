from sqlalchemy import Boolean, Column, String, ForeignKey, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid


class ConstructLink(Base):
    __tablename__ = "construct_links"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    source_id = Column(UUID(as_uuid=True), ForeignKey("constructs.id"), nullable=False)
    target_id = Column(UUID(as_uuid=True), ForeignKey("constructs.id"), nullable=False)
    link_type = Column(String, nullable=True)
    label = Column(String, nullable=True)
    notes = Column(String, nullable=True) 
    is_bidirectional = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),
                        onupdate=func.now(), default=func.now())

    source = relationship("Construct", foreign_keys=[source_id], backref="outgoing_links", passive_deletes=True)
    target = relationship("Construct", foreign_keys=[target_id], backref="incoming_links", passive_deletes=True)


    __table_args__ = (
        Index('idx_construct_links_source', 'source_id'),
        Index('idx_construct_links_target', 'target_id'),
        Index('idx_construct_links_source_target', 'source_id', 'target_id'),
    )
