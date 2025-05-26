from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.construct import Construct
from uuid import UUID
from app.crud import construct as crud


import logging

logger = logging.getLogger(__name__)

async def get_construct_by_id(
    db: AsyncSession,
    construct_id: UUID
) -> Optional[Construct]:
    """
    Retrieve a construct by its ID.
    
    Args:
        db (AsyncSession): The database session.
        construct_id (UUID): The ID of the construct to retrieve.
    
    Returns:
        Optional[Construct]: The construct if found, otherwise None.
    """
    try:
        result = await db.execute(select(Construct).where(Construct.id == construct_id))
        return result.scalar_one_or_none()
    except Exception as e:
        logger.error(f"Error retrieving construct by ID {construct_id}: {e}")
        return None
    
async def get_all_constructs(
    db: AsyncSession
) -> list[Construct]:
    """
    Retrieve all constructs from the database.
    
    Args:
        db (AsyncSession): The database session.
    
    Returns:
        list[Construct]: A list of all constructs.
    """
    try:
        result = await db.execute(select(Construct))
        return result.scalars().all()
    except Exception as e:
        logger.error(f"Error retrieving all constructs: {e}")
        return []
    

async def create_construct(
    db: AsyncSession,
    construct: Construct
) -> Construct:
    """
    Create a new construct in the database.
    
    Args:
        db (AsyncSession): The database session.
        construct (Construct): The construct to create.
    
    Returns:
        Construct: The created construct.
    """
    try:
        db.add(construct)
        await db.commit()
        await db.refresh(construct)
        return construct
    except Exception as e:
        logger.error(f"Error creating construct: {e}")
        await db.rollback()
        raise e