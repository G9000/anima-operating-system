from typing import List, Optional, Literal
from pydantic import BaseModel, Field
import uuid

class HealthResponse(BaseModel):
    message: str
    status: int

class ChatHistory(BaseModel):
    query: str
    response: str

class AgentChatRequest(BaseModel):
    query: str
    chat_history: List[ChatHistory] = []
    thread_id: str
    mode: Optional[Literal["chat", "roleplay", "journal", "story", "assist", "silent"]] = "chat"

class AgentChatResponse(BaseModel):
    type: str
    content: str

class ChatMessage(BaseModel):
    role: str
    content: str
    name: Optional[str] = None

class ChatRequest(BaseModel):
    model: str = "animaos-agent"
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None
    stream: Optional[bool] = False
    thread_id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    mode: Optional[Literal["chat", "roleplay", "journal", "story", "assist", "silent"]] = "chat"

class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str]

class ChatUsage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatChoice]
    usage: ChatUsage

class ConversationMessage(BaseModel):
    role: str  # 'user', 'assistant', 'system'
    content: str
    timestamp: Optional[str] = None

class ConversationHistory(BaseModel):
    thread_id: str
    messages: List[ConversationMessage]
    created_at: str
    last_updated: str
    message_count: int
