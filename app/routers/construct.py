from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
import logging

from app.schemas.construct_models import (
    ConstructCreateRequest, 
    ConstructUpdateRequest, 
    ConstructResponse
)
from app.db.session import get_db
from app.crud import construct as construct_crud
from app.models.construct import Construct
from app.middleware.auth_supabase import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/constructs", tags=["constructs"])

@router.post("/", response_model=ConstructResponse, status_code=status.HTTP_201_CREATED)
async def create_construct(
    construct_request: ConstructCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Create a new construct.
    
    Args:
        construct_request (ConstructCreateRequest): The construct creation request.
        db (AsyncSession): The database session.
        current_user_id (UUID): The current authenticated user ID.
    
    Returns:
        ConstructResponse: The created construct.
    """
    try:
        new_construct = Construct(
            name=construct_request.name,
            data=construct_request.data or {},
            creator_id=current_user_id
        )
        created_construct = await construct_crud.create_construct(db, new_construct)
        
        return ConstructResponse.model_validate(created_construct)
        
    except Exception as e:
        logger.error(f"Error creating construct: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create construct"
        )

@router.get("/{construct_id}", response_model=ConstructResponse)
async def get_construct(
    construct_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Get a construct by ID.
    
    Args:
        construct_id (UUID): The ID of the construct to retrieve.
        db (AsyncSession): The database session.
        current_user_id (UUID): The current authenticated user ID.
    
    Returns:
        ConstructResponse: The construct data.
    """
    try:
        construct = await construct_crud.get_construct_by_id(db, construct_id)
        
        if not construct:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construct not found"
            )
        if construct.creator_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return ConstructResponse.model_validate(construct)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving construct {construct_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve construct"
        )

@router.get("/", response_model=List[ConstructResponse])
async def get_user_constructs(
    db: AsyncSession = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Get all constructs for the current user.
    
    Args:
        db (AsyncSession): The database session.
        current_user_id (UUID): The current authenticated user ID.
    
    Returns:
        List[ConstructResponse]: List of user's constructs.
    """
    try:
        result = await db.execute(
            select(Construct).where(Construct.creator_id == current_user_id)
        )
        constructs = result.scalars().all()
        
        return [ConstructResponse.model_validate(construct) for construct in constructs]
        
    except Exception as e:
        logger.error(f"Error retrieving constructs for user {current_user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve constructs"
        )

@router.put("/{construct_id}", response_model=ConstructResponse)
async def update_construct(
    construct_id: UUID,
    construct_update: ConstructUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Update a construct.
    
    Args:
        construct_id (UUID): The ID of the construct to update.
        construct_update (ConstructUpdateRequest): The construct update data.
        db (AsyncSession): The database session.
        current_user_id (UUID): The current authenticated user ID.
    
    Returns:
        ConstructResponse: The updated construct.
    """
    try:
        construct = await construct_crud.get_construct_by_id(db, construct_id)
        
        if not construct:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construct not found"
            )
        
        if construct.creator_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        if construct_update.name is not None:
            construct.name = construct_update.name
        if construct_update.data is not None:
            construct.data = construct_update.data
        
        await db.commit()
        await db.refresh(construct)
        
        return ConstructResponse.model_validate(construct)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating construct {construct_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update construct"
        )

@router.delete("/{construct_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_construct(
    construct_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Delete a construct.
    
    Args:
        construct_id (UUID): The ID of the construct to delete.
        db (AsyncSession): The database session.
        current_user_id (UUID): The current authenticated user ID.
    """
    try:
        construct = await construct_crud.get_construct_by_id(db, construct_id)
        
        if not construct:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construct not found"
            )
        
        if construct.creator_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        await db.delete(construct)
        await db.commit()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting construct {construct_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete construct"
        )
