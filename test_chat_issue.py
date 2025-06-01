"""
Test script to reproduce the "OS circling wrist" issue where the AI responds
as the construct instead of answering the user's question.
"""
import asyncio
import json
import sys
import uuid
from pathlib import Path

# Add the app directory to the Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

from app.services.enhanced_chat_service import enhanced_chat_service
from app.schemas.chat_models import ChatRequest, ChatMessage
from app.db.session import get_db

async def test_chat_issue():
    """Test the specific issue where AI responds as construct instead of answering questions."""
    
    print("🐛 Testing Chat Issue: AI responding as construct instead of answering user")
    print("=" * 80)
    
    # Check if service is available
    if not enhanced_chat_service.is_available():
        print("❌ Enhanced chat service is NOT available")
        return
    
    print("✅ Enhanced chat service is available")
    
    # Test with a simple direct question 
    test_request = ChatRequest(
        model="gemma3:27b",  # Use the updated model
        messages=[
            ChatMessage(role="user", content="What is 2 + 2?")
        ],
        construct_id=None,  # No construct to start with
        mode="chat",
        thread_id=f"test-math-{uuid.uuid4()}",
        stream=False,
        temperature=0.3,
        max_tokens=150
    )
    
    print(f"\n📝 Test Request:")
    print(f"   Model: {test_request.model}")
    print(f"   Mode: {test_request.mode}")
    print(f"   Message: {test_request.messages[0].content}")
    print(f"   Construct ID: {test_request.construct_id}")
    print(f"   Thread ID: {test_request.thread_id}")
    
    try:
        # Get a database session
        async for db in get_db():
            print(f"\n🚀 Processing request...")
            
            # Create a mock user ID
            user_id = uuid.uuid4()
            
            # Process the request
            result = await enhanced_chat_service.process_chat_request(
                request=test_request,
                user_id=user_id,
                db=db
            )
            
            print(f"\n📋 Response:")
            print(f"   Type: {type(result)}")
            
            # Handle different response types
            if hasattr(result, 'status_code'):
                print(f"   Status Code: {result.status_code}")
                if hasattr(result, 'body'):
                    content = await result.body()
                    print(f"   Error Content: {content}")
                else:
                    print(f"   Error Response: {result}")
            elif isinstance(result, dict):
                print(f"   Content: {json.dumps(result, indent=2)}")
                
                # Extract the actual AI response
                if "choices" in result and len(result["choices"]) > 0:
                    ai_response = result["choices"][0]["message"]["content"]
                    print(f"\n🤖 AI Response: {ai_response}")
                    
                    # Check if the response actually answers the question
                    if "4" in ai_response:
                        print("✅ AI correctly answered the math question!")
                    else:
                        print("❌ AI did not answer the math question correctly")
                        print("🔍 This might be the construct personality override issue")
                        
            else:
                print(f"   Raw Result: {result}")
            
            break  # Exit after first db session
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")

if __name__ == "__main__":
    asyncio.run(test_chat_issue())
