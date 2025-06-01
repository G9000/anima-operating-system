#!/usr/bin/env python3
"""
Debug script to understand the memory issue in enhanced chat service.
"""
import asyncio
import json
from uuid import uuid4
from app.services.enhanced_chat_service import enhanced_chat_service
from app.schemas.chat_models import ChatRequest, ChatMessage

async def debug_memory_issue():
    """Debug the memory issue with conversation context."""
    
    # Use the same thread_id for both requests
    thread_id = "e7b62655-6f57-4284-9449-772abbfd4ac8"
    construct_id = "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83" 
    user_id = uuid4()
    
    print("🔍 Debugging memory issue...")
    print(f"Thread ID: {thread_id}")
    print(f"Construct ID: {construct_id}")
    
    # Mock database session (simplified for testing)
    class MockDB:
        pass
    
    db = MockDB()
    
    print("\n=== FIRST REQUEST ===")
    # First request: "My name Julio What yours?"
    request1 = ChatRequest(
        model="gemma3:27b",
        messages=[
            ChatMessage(role="user", content="My name Julio What yours?")
        ],
        construct_id=construct_id,
        temperature=0.7,
        max_tokens=0,
        stream=False,
        thread_id=thread_id,
        mode="chat"
    )
    
    # Check memory before first request
    memory_stats = enhanced_chat_service.memory_saver.storage
    print(f"📊 Memory before first request: {len(memory_stats) if memory_stats else 0} threads")
    
    try:
        result1 = await enhanced_chat_service.process_chat_request(request1, user_id, db)
        print(f"✅ First response completed")
        
        # Check memory after first request
        memory_stats = enhanced_chat_service.memory_saver.storage
        print(f"📊 Memory after first request: {len(memory_stats) if memory_stats else 0} threads")
        if memory_stats and thread_id in memory_stats:
            stored_data = memory_stats[thread_id]
            print(f"📝 Stored data keys: {list(stored_data.keys()) if stored_data else 'None'}")
            
    except Exception as e:
        print(f"❌ First request error: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print("\n=== SECOND REQUEST ===")
    # Second request: "Do you remember my name?"
    request2 = ChatRequest(
        model="gemma3:27b",
        messages=[
            ChatMessage(role="user", content="Do you remember my name?")
        ],
        construct_id=construct_id,
        temperature=0.7,
        max_tokens=0,
        stream=False,
        thread_id=thread_id,  # Same thread ID
        mode="chat"
    )
    
    try:
        result2 = await enhanced_chat_service.process_chat_request(request2, user_id, db)
        print(f"✅ Second response completed")
        
        # Check memory after second request
        memory_stats = enhanced_chat_service.memory_saver.storage
        print(f"📊 Memory after second request: {len(memory_stats) if memory_stats else 0} threads")
        
    except Exception as e:
        print(f"❌ Second request error: {e}")
        import traceback
        traceback.print_exc()
        return
    
    print("\n=== ANALYSIS ===")
    print("If memory is working correctly:")
    print("- The second request should remember 'Julio' from the first request")
    print("- The memory storage should contain conversation history")
    print("- Each request should build on the previous context")

if __name__ == "__main__":
    asyncio.run(debug_memory_issue())
