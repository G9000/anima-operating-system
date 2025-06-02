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
  MessageSquare,
  PersonStanding,
  BookOpen,
  PenTool,
  Wrench,
  VolumeX,
  FileText,
} from "lucide-react";
import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Textarea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

type ChatMode = "chat" | "roleplay" | "journal" | "story" | "assist" | "silent";

interface ChatModeConfig {
  id: ChatMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const chatModes: ChatModeConfig[] = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    description: "Standard conversational interaction",
  },
  {
    id: "roleplay",
    label: "Roleplay",
    icon: PersonStanding,
    description: "Immersive character roleplay scenarios",
  },
  {
    id: "journal",
    label: "Journal",
    icon: BookOpen,
    description: "Reflective, diary-style interactions",
  },
  {
    id: "story",
    label: "Story",
    icon: PenTool,
    description: "Collaborative storytelling mode",
  },
  {
    id: "assist",
    label: "Assist",
    icon: Wrench,
    description: "Task-focused assistance mode",
  },
  {
    id: "silent",
    label: "Silent",
    icon: VolumeX,
    description: "Minimal response, observation mode",
  },
];

interface ChatInterfaceProps {
  className?: string;
  threadId?: string;
}

const streamChat = async (
  messages: Array<{ role: string; content: string }>,
  threadId: string,
  personaId: string,
  conversationMode:
    | "chat"
    | "roleplay"
    | "journal"
    | "story"
    | "assist"
    | "silent",
  onChunk: (chunk: string) => void
) => {
  try {
    console.log(
      `🚀 Sending ${messages.length} messages with thread_id: ${threadId}`
    );

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({
        model: "gemma3:27b",
        messages: messages,
        temperature: 0.7,
        max_tokens: 0,
        stream: true,
        thread_id: threadId,
        mode: conversationMode,
        construct_id: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83",
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

  // Generate a consistent thread_id for this chat session
  const [currentThreadId] = useState(() => {
    // Use provided threadId or generate a new one for this session
    const id =
      threadId ||
      `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("🧠 Chat Interface using thread_id:", id);
    return id;
  });
  const personas = [
    {
      id: "assistant",
      name: "Assistant",
      color: "from-blue-500 to-cyan-500",
      icon: Sparkles,
      constructId: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83", // Default assistant construct
    },
    {
      id: "creative",
      name: "Creative Writer",
      color: "from-purple-500 to-pink-500",
      icon: Palette,
      constructId: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83", // TODO: Replace with actual creative writer construct ID
    },
    {
      id: "analyst",
      name: "Data Analyst",
      color: "from-green-500 to-emerald-500",
      icon: Brain,
      constructId: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83", // TODO: Replace with actual analyst construct ID
    },
    {
      id: "coach",
      name: "Life Coach",
      color: "from-orange-500 to-yellow-500",
      icon: Zap,
      constructId: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83", // TODO: Replace with actual coach construct ID
    },
  ];
  const currentPersona =
    personas.find((p) => p.name === selectedPersona) || personas[0];

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
      setStreamingMessageId(messageId); // Send only the current user message - let InMemorySaver handle conversation history
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
        currentMessage, // Send only current message
        currentThreadId, // Use the consistent thread_id for memory
        currentPersona.constructId, // Use construct ID from selected persona
        chatMode, // Use the selected chat mode
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
          construct_id: currentPersona.constructId,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className={cn("h-full flex flex-col", className)}>
      {" "}
      <ChatHeader
        persona={selectedPersona}
        currentPersona={currentPersona}
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
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <ChatEmptyState construct={currentPersona} />
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group",
                    message.sender === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  )}
                >
                  {" "}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm leading-relaxed",
                      message.sender === "user"
                        ? "max-w-[85%] bg-primary text-primary-foreground ml-12"
                        : "w-full bg-muted text-foreground"
                    )}
                  >
                    <ChatMessageBubble
                      message={message}
                      streamingMessageId={streamingMessageId}
                    />
                  </div>
                </div>
              ))}{" "}
              {isTyping && (
                <div className="flex justify-start">
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
              )}{" "}
              {/* Chat Summary Display */}
              {(isSummarizing || chatSummary) && (
                <div className="group flex justify-start">
                  <div className="w-full bg-muted text-foreground rounded-lg px-4 py-3 text-sm leading-relaxed">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Chat Summary
                      </span>
                    </div>
                    {isSummarizing ? (
                      <div className="flex items-center gap-2">
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
                        <span className="text-sm text-muted-foreground">
                          Generating summary...
                        </span>
                      </div>
                    ) : chatSummary ? (
                      <div className="text-sm text-foreground leading-relaxed">
                        {chatSummary}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <ChatTextInput
        construct={currentPersona}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        isTyping={isTyping}
        streamingMessageId={streamingMessageId}
        handleKeyPress={handleKeyPress}
        inputRef={inputRef}
      />
    </div>
  );
}

const ChatHeaderAvatar = ({ persona }: { persona: Persona }) => {
  return (
    <Avatar className="size-10">
      <AvatarImage src="/animaos.webp" alt="avatar" />

      <AvatarFallback className="text-primary-foreground">
        {persona.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const ChatHeader = ({
  persona,
  currentPersona,
  status,
  exportChat,
  clearChat,
  chatMode,
  onModeChange,
  summarizeChat,
  isSummarizing,
}: {
  persona: string;
  currentPersona: Persona;
  status?: string;
  exportChat: () => void;
  clearChat: () => void;
  chatMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  summarizeChat: () => void;
  isSummarizing: boolean;
}) => {
  return (
    <div className="flex w-11/12 items-center justify-between py-4 absolute top-0 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center space-x-4">
        <ChatHeaderAvatar persona={currentPersona} />
        <div>
          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
            {persona || "AI Assistant"}
          </h2>
          <p className="-mt-1 text-sm text-foreground/60 flex items-center gap-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
            {status || "Online"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Chat Mode Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono hover:bg-primary/10 flex items-center gap-2"
              title="Change conversation mode"
            >
              {(() => {
                const currentMode = chatModes.find(
                  (mode) => mode.id === chatMode
                );
                const IconComponent = currentMode?.icon || MessageSquare;
                return (
                  <>
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {currentMode?.label}
                    </span>
                  </>
                );
              })()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {chatModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <DropdownMenuItem
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer",
                    chatMode === mode.id && "bg-primary/10"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{mode.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {mode.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        <Button
          variant="ghost"
          size="sm"
          onClick={summarizeChat}
          disabled={isSummarizing}
          className="text-xs font-mono hover:bg-primary/10"
          title="Summarize Chat"
        >
          <FileText className="w-4 h-4" />
        </Button>
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
          <Trash2 className="w-4 h-4" />{" "}
        </Button>
      </div>
    </div>
  );
};

const ChatEmptyState = ({ construct }: { construct: Persona }) => {
  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="flex flex-col items-center gap-5 text-center relative">
        <div className="absolute inset-0 -m-8 bg-background/80 backdrop-blur-md rounded-2xl" />

        <div className="relative z-10 p-8">
          <Avatar className="size-16 mx-auto mb-4">
            <AvatarImage src="/animaos.webp" alt="avatar" />
            <AvatarFallback className="text-primary-foreground">
              {construct.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Let's start a conversation
            </h3>
            <p className="text-muted-foreground max-w-md">
              Share your thoughts, questions, or ideas - I'm here to chat,
              create, and explore together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatTextInput = ({
  construct,
  inputValue,
  setInputValue,
  handleSendMessage,
  isTyping,
  streamingMessageId,
  handleKeyPress,
  inputRef,
}: {
  construct: Persona;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  streamingMessageId: string | null;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full">
      <div className="flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative border border-border/20 bg-background/95 backdrop-blur-sm rounded-xl">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder={`Message ${construct.name}...`}
              className={cn(
                "h-22 w-full pr-12 py-3 px-4",
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
        </div>
      </div>
    </div>
  );
};

const ChatMessageBubble = ({
  message,
  streamingMessageId,
}: {
  message: Message;
  streamingMessageId: string | null;
}) => {
  return (
    <div className="relative">
      <MarkdownRenderer
        content={message.content}
        className={cn(
          message.sender === "user"
            ? "text-primary-foreground"
            : "text-foreground"
        )}
      />
      {streamingMessageId === message.id && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
      )}
      <div
        className={cn(
          "mt-2 text-xs flex items-center gap-1",
          message.sender === "user"
            ? "justify-end text-primary-foreground/70"
            : "justify-start text-muted-foreground/60"
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
  );
};
