"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { Message, ChatMode, ChatInterfaceProps } from "./types";
import { construct } from "./config";
import { ChatHeader } from "./ChatHeader";
import { ChatTextInput } from "./ChatTextInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { streamChat } from "./chatService";

export function ChatInterface({ className, threadId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [selectedPersona, setSelectedPersona] = useState("Assistant");
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [chatSummary, setChatSummary] = useState<string | null>(null);

  const [currentThreadId] = useState(() => {
    const id =
      threadId ||
      `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("🧠 Chat Interface using thread_id:", id);
    return id;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const streamAIResponse = async (userMessage: string, messageId: string) => {
    try {
      console.log(`🚀 Sending message with thread_id: ${currentThreadId}`);
      console.log(`📝 Message: ${userMessage.substring(0, 50)}...`);

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

      const currentMessage = [
        {
          role: "user" as const,
          content: userMessage,
        },
      ];

      console.log(
        `📋 Sending current message only (${currentMessage.length} message) - InMemorySaver will handle conversation history`
      );

      let currentContent = "";
      await streamChat(
        currentMessage,
        currentThreadId,
        construct.id,
        chatMode,
        (chunk: string) => {
          try {
            currentContent += chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId ? { ...msg, content: currentContent } : msg
              )
            );
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
    setChatSummary(null);
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

  const summarizeChat = async () => {
    if (messages.length === 0) {
      alert("No messages to summarize");
      return;
    }

    setIsSummarizing(true);
    setChatSummary(null);

    try {
      // Convert messages to the format expected by the summarization API
      const conversationMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const response = await fetch("/api/chat/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          messages: conversationMessages,
          construct_id: construct.id,
          summary_style: "brief",
          mode: "construct",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const summary = data.summary || "Failed to generate summary";
      setChatSummary(summary);
    } catch (error) {
      console.error("Summarization error:", error);
      setChatSummary("Sorry, I couldn't generate a summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <ChatHeader
        persona={selectedPersona}
        currentPersona={construct}
        status="Online"
        exportChat={exportChat}
        clearChat={clearChat}
        chatMode={chatMode}
        onModeChange={setChatMode}
        summarizeChat={summarizeChat}
        isSummarizing={isSummarizing}
      />

      <div className="flex flex-col flex-1 overflow-y-auto max-w-3xl w-full mx-auto bg-cover bg-center bg-no-repeat pb-52">
        <div className="px-4 py-6 flex-1 flex flex-col">
          {messages.length !== 0 && (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group flex",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "relative max-w-[80%] rounded-3xl px-4 py-3 shadow-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted/50 text-foreground mr-4"
                    )}
                  >
                    <ChatMessageBubble
                      message={message}
                      streamingMessageId={streamingMessageId}
                    />
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="group flex justify-start">
                  <div className="relative max-w-[80%] rounded-3xl px-4 py-3 shadow-sm bg-muted/50 text-foreground mr-4">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-muted-foreground/70 ml-2">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(isSummarizing || chatSummary) && (
                <div className="group flex justify-start">
                  <div className="relative max-w-[80%] rounded-3xl px-4 py-3 shadow-sm bg-blue-50/50 text-foreground mr-4 border border-blue-200/30">
                    {isSummarizing ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-blue-600/80">
                          Generating summary...
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-medium text-blue-600/80 mb-1">
                          Chat Summary
                        </div>
                        <div className="text-sm text-blue-800/90">
                          {chatSummary}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <ChatTextInput
        construct={construct}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        isTyping={isTyping}
        streamingMessageId={streamingMessageId}
        handleKeyPress={handleKeyPress}
        inputRef={inputRef}
        className={cn(
          "max-w-3xl mx-auto px-4 absolute left-1/2 transform -translate-x-1/2",
          messages.length === 0 ? "top-1/2" : "bottom-4"
        )}
        showModeSelector={messages.length === 0}
        chatMode={chatMode}
        onModeChange={setChatMode}
      />
    </div>
  );
}
