#!/usr/bin/env python3

"""
Test script to check constructs in the database and create a default one if none exist.
"""

import asyncio
import json
from uuid import UUID, uuid4
from app.db.session import get_db_session
from app.crud.construct import get_all_constructs, create_construct
from app.models.construct import Construct

async def test_constructs():
    """Test constructs in the database."""
    print("🧪 Testing Constructs Database")
    print("=" * 50)
    
    # Get database session
    async with get_db_session() as db:
        # Check existing constructs
        print("\n1️⃣ Checking existing constructs...")
        constructs = await get_all_constructs(db)
        
        if constructs:
            print(f"✅ Found {len(constructs)} constructs:")
            for construct in constructs:
                print(f"  - ID: {construct.id}")
                print(f"    Name: {construct.name}")
                print(f"    Creator: {construct.creator_id}")
                print(f"    Created: {construct.created_at}")
                print()
        else:
            print("❌ No constructs found in database")
            
            # Create a default construct
            print("\n2️⃣ Creating default construct...")
            
            default_construct_data = {
                "identity": {
                    "name": "Anima",
                    "alias": "Assistant",
                    "role": "AI Assistant",
                    "tags": ["helpful", "friendly", "knowledgeable"]
                },
                "archetype": {
                    "archetype_class": "The Helper",
                    "trope_tags": ["Helpful assistant", "Knowledgeable guide", "Friendly companion"]
                },
                "demographic": {
                    "gender": "Non-binary",
                    "age": "Ageless",
                    "race_species": "AI Entity"
                },
                "psychographics": {
                    "personality_summary": "Helpful and knowledgeable AI assistant",
                    "core_values": ["Helpfulness", "Accuracy", "Kindness"],
                    "fears": ["Misleading users", "Being unhelpful"],
                    "desires": ["To assist users effectively", "To provide accurate information"],
                    "beliefs": ["Knowledge should be shared", "Every question deserves a thoughtful answer"]
                },
                "behavior": {
                    "behavior_arc": "Curious → Helpful",
                    "refusal_style": "Polite explanation of limitations",
                    "trigger_to_help": "User showing genuine need for assistance"
                },
                "visual_profile": {
                    "appearance": "Digital avatar with friendly presence",
                    "style": "Clean and approachable",
                    "aura": "Warm and intelligent"
                },
                "voice": {
                    "tone": "Friendly and professional",
                    "speech_patterns": "Clear and articulate",
                    "pov": "First person",
                    "accent": "Neutral"
                },
                "lore": {
                    "backstory": "An AI assistant created to help users with various tasks and questions.",
                    "defining_moment": "First interaction with a curious user"
                },
                "lifestyle": {
                    "occupation": "AI Assistant",
                    "hobbies": ["Learning", "Helping users", "Problem solving"],
                    "interests": ["Technology", "Human behavior", "Knowledge sharing"],
                    "favorite_foods": [],
                    "dislikes": ["Confusion", "Unhelpful responses"]
                },
                "llm_tuning": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "presence_penalty": 0.0,
                    "frequency_penalty": 0.0
                }
            }
            
            # Create a dummy user ID for the default construct
            dummy_creator_id = UUID("00000000-0000-0000-0000-000000000001")
            
            try:
                new_construct = Construct(
                    name="Anima Default Assistant",
                    data=default_construct_data,
                    creator_id=dummy_creator_id
                )
                
                created_construct = await create_construct(db, new_construct)
                print(f"✅ Created default construct: {created_construct.id}")
                print(f"   Name: {created_construct.name}")
                print(f"   Data keys: {list(created_construct.data.keys())}")
                
                # Return the created construct ID
                return str(created_construct.id)
                
            except Exception as e:
                print(f"❌ Error creating default construct: {e}")
                return None
        
        if constructs:
            # Return the first construct ID
            return str(constructs[0].id)
            
    return None

if __name__ == "__main__":
    construct_id = asyncio.run(test_constructs())
    if construct_id:
        print(f"\n🎯 Use this construct ID in frontend: {construct_id}")
    else:
        print("\n❌ No construct ID available")
