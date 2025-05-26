"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Trash2,
  Download,
  MoreVertical,
  Sparkles,
  Zap,
  Brain,
  Palette,
} from "lucide-react";
import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Textarea,
} from "@/app/components/base";
import { cn } from "@/app/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  persona?: string;
}

interface Persona {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ChatInterfaceProps {
  className?: string;
}

const streamChat = async (
  content: string,
  threadId: string,
  personaId: string,
  conversationMode: "chat" | "roleplay",
  onChunk: (chunk: string) => void
) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({
        model: "animaos-agent",
        messages: [
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.7,
        max_tokens: 0,
        stream: true,
        thread_id: "new-test-2",
        conversation_mode: conversationMode,
        persona_id: "9619c8ad-91b3-4771-8091-2d239e2cf221",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    const processChunkWithDelay = async (chunk: string) => {
      for (const line of chunk.split(/\r?\n/)) {
        if (!line.trim() || line === "data: [DONE]") continue;

        let jsonStr = line;
        if (line.startsWith("data:")) jsonStr = line.slice(5).trim();

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;

          if (content) {
            onChunk(line);
            const baseDelay = 50;
            const variableDelay =
              content.length < 3
                ? baseDelay - 20 + Math.random() * 30
                : baseDelay - 10 + Math.random() * 20;

            await new Promise((resolve) => setTimeout(resolve, variableDelay));
          }
        } catch (e) {}
      }
    };

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const decodedChunk = decoder.decode(value);
        await processChunkWithDelay(decodedChunk);
      }
    }
  } catch (error) {
    console.error("Error streaming chat:", error);
    throw error;
  }
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [selectedPersona, setSelectedPersona] = useState("Assistant");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const personas = [
    {
      id: "assistant",
      name: "Assistant",
      color: "from-blue-500 to-cyan-500",
      icon: Sparkles,
    },
    {
      id: "creative",
      name: "Creative Writer",
      color: "from-purple-500 to-pink-500",
      icon: Palette,
    },
    {
      id: "analyst",
      name: "Data Analyst",
      color: "from-green-500 to-emerald-500",
      icon: Brain,
    },
    {
      id: "coach",
      name: "Life Coach",
      color: "from-orange-500 to-yellow-500",
      icon: Zap,
    },
  ];

  const currentPersona =
    personas.find((p) => p.name === selectedPersona) || personas[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const streamAIResponse = async (userMessage: string, messageId: string) => {
    try {
      const initialMessage: Message = {
        id: messageId,
        content: "",
        sender: "ai",
        timestamp: new Date(),
        persona: selectedPersona,
      };

      setMessages((prev) => [...prev, initialMessage]);
      setIsTyping(false);
      setStreamingMessageId(messageId);

      let currentContent = "";

      await streamChat(
        userMessage,
        "new-test-2",
        "9619c8ad-91b3-4771-8091-2d239e2cf221",
        "chat",
        (chunk: string) => {
          try {
            let jsonStr = chunk;
            if (chunk.startsWith("data:")) {
              jsonStr = chunk.slice(5).trim();
            }

            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              currentContent += content;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === messageId
                    ? { ...msg, content: currentContent }
                    : msg
                )
              );
            }
          } catch (parseError) {
            console.warn("Failed to parse chunk:", chunk, parseError);
          }
        }
      );

      setStreamingMessageId(null);
    } catch (error) {
      console.error("Streaming error:", error);

      // Show error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your request. Please try again.",
              }
            : msg
        )
      );

      setStreamingMessageId(null);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time before starting stream
    setTimeout(async () => {
      const aiMessageId = (Date.now() + 1).toString();
      await streamAIResponse(messageContent, aiMessageId);
    }, 500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const clearChat = () => {
    setMessages([]);
    setStreamingMessageId(null);
    setIsTyping(false);
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      persona: selectedPersona,
      messages: messages.map((msg) => ({
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        persona: msg.persona,
      })),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anima-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      <div className="flex-shrink-0 border-b border-border/20 bg-background/95 backdrop-blur-sm">
        <div className="w-full mx-auto px-4 py-3">
          <ChatHeader
            persona={selectedPersona}
            currentPersona={currentPersona}
            status="Online"
            exportChat={exportChat}
            clearChat={clearChat}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  How can I help you today?
                </h3>
                <p className="text-muted-foreground max-w-md">
                  I'm AnimaOS AI, ready to assist you with questions, creative
                  tasks, analysis, and more.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "group",
                    message.sender === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  )}
                >
                  <div
                    className={cn(
                      " rounded-lg px-4 py-3 text-sm leading-relaxed",
                      message.sender === "user"
                        ? "max-w-[85%] bg-primary text-primary-foreground ml-12"
                        : "w-full bg-muted text-foreground"
                    )}
                  >
                    {message.sender === "ai" ? (
                      <div className="relative">
                        <MarkdownRenderer content={message.content} />
                        {streamingMessageId === message.id && (
                          <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                        )}
                        <div className="mt-2 text-xs text-muted-foreground/60 flex items-center gap-1">
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div
                          className={cn(
                            "mt-2 text-xs text-primary-foreground/70 flex items-center justify-end gap-1",
                            message.sender === "user"
                              ? "text-right"
                              : "text-left"
                          )}
                        >
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/20 bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {" "}
          <div className="relative">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message AnimaOS..."
              className={cn(
                "min-h-[56px] max-h-32 w-full pr-12 py-3 px-4",
                "bg-background border border-border/20 rounded-xl",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:border-primary/40 focus:ring-1 focus:ring-primary/20",
                "transition-all duration-200",
                "resize-none overflow-hidden"
              )}
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !inputValue.trim() || isTyping || streamingMessageId !== null
              }
              size="sm"
              className={cn(
                "absolute right-2 bottom-2 h-8 w-8 p-0",
                "bg-primary hover:bg-primary/90",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {isTyping
              ? "AnimaOS is thinking..."
              : streamingMessageId
              ? "AnimaOS is responding..."
              : "Press Enter to send, Shift+Enter for new line"}
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatHeaderAvatar = ({ persona }: { persona: Persona }) => {
  const Icon = persona.icon;
  return (
    <div>
      <Avatar className="size-10">
        <AvatarImage src="/animaos.webp" alt="avatar" />

        <AvatarFallback className="text-primary-foreground">
          {persona.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

const ChatHeader = ({
  persona,
  currentPersona,
  status,
  exportChat,
  clearChat,
}: {
  persona: string;
  currentPersona: Persona;
  status?: string;
  exportChat: () => void;
  clearChat: () => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <ChatHeaderAvatar persona={currentPersona} />
        <div>
          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
            {persona || "AI Assistant"}
          </h2>
          <p className="text-sm text-foreground/60 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {status || "Online"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={exportChat}
          className="text-xs font-mono hover:bg-primary/10"
          title="Export Chat"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-xs font-mono hover:bg-primary/10"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
