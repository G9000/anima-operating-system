from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, ENUM
from enum import Enum as PyEnum
import uuid
from app.db.database import Base


class UserRole(PyEnum):
    USER = "USER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(
        ENUM(UserRole, name="userrole", create_type=True),
        default=UserRole.USER,
        server_default=UserRole.USER.value,
        nullable=False
    )
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(
    ), onupdate=func.now(), nullable=False)
    