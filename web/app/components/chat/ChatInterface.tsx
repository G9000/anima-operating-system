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
  Image as ImageIcon,
} from "lucide-react";
import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const [background, setBackground] = useState<string>("default");
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [uploadedBg, setUploadedBg] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(1);
  const [bubbleColor, setBubbleColor] = useState<string>("default");
  const [customBgColor, setCustomBgColor] = useState<string>("#ffffff");
  const [customUserBubbleColor, setCustomUserBubbleColor] =
    useState<string>("#3b82f6");
  const [customAiBubbleColor, setCustomAiBubbleColor] =
    useState<string>("#f1f5f9");
  const [useCustomColors, setUseCustomColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const bubbleColors = [
    {
      id: "default",
      label: "Default",
      userColor: "bg-primary",
      aiColor: "bg-muted",
    },
    {
      id: "blue",
      label: "Blue Theme",
      userColor: "bg-blue-500",
      aiColor: "bg-blue-100",
    },
    {
      id: "green",
      label: "Green Theme",
      userColor: "bg-green-500",
      aiColor: "bg-green-100",
    },
    {
      id: "purple",
      label: "Purple Theme",
      userColor: "bg-purple-500",
      aiColor: "bg-purple-100",
    },
    {
      id: "pink",
      label: "Pink Theme",
      userColor: "bg-pink-500",
      aiColor: "bg-pink-100",
    },
    {
      id: "custom",
      label: "Custom Colors",
      userColor: "bg-[var(--custom-user-color)]",
      aiColor: "bg-[var(--custom-ai-color)]",
    },
  ];

  const backgrounds = [
    {
      id: "default",
      label: "Default",
      value: "bg-background",
      type: "color",
      preview: "#ffffff",
    },
    {
      id: "Lucy",
      label: "Lucy",
      value: "url('/backgrounds/chat-bg-sample-1.png')",
      type: "image",
      preview: "/backgrounds/chat-bg-sample-1.png",
    },
    {
      id: "Flower",
      label: "Flower",
      value: "url('/backgrounds/chat-bg-sample-2.png')",
      type: "image",
      preview: "/backgrounds/chat-bg-sample-2.png",
    },
    {
      id: "green",
      label: "Forest Green",
      value: "#e7f6d5",
      type: "color",
      preview: "#e7f6d5",
    },
    {
      id: "blue",
      label: "Ocean Blue",
      value: "#d0e7ff",
      type: "color",
      preview: "#d0e7ff",
    },
    {
      id: "purple",
      label: "Lavender",
      value: "#f3e8ff",
      type: "color",
      preview: "#f3e8ff",
    },
    {
      id: "pink",
      label: "Rose",
      value: "#fdf2f8",
      type: "color",
      preview: "#fdf2f8",
    },
    {
      id: "custom",
      label: "Custom Color",
      value: customBgColor,
      type: "color",
      preview: customBgColor,
    },
    ...(uploadedBg
      ? [
          {
            id: "uploaded",
            label: "Your Image",
            value: `url('${uploadedBg}')`,
            type: "image",
            preview: uploadedBg,
          },
        ]
      : []),
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const getBackgroundStyle = () => {
    const currentBg = backgrounds.find((bg) => bg.id === background);
    if (!currentBg) return {};

    if (currentBg.type === "image") {
      return {
        backgroundImage: currentBg.value,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // backgroundAttachment: "fixed",
        opacity: bgOpacity,
      };
    }

    if (currentBg.type === "color") {
      return {
        background: background === "custom" ? customBgColor : currentBg.value,
        opacity: bgOpacity,
      };
    }

    return {};
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setUploadedBg(event.target.result);
          setBackground("uploaded");
          setShowBgPicker(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const getBubbleColors = () => {
    const selectedTheme = bubbleColors.find(
      (color) => color.id === bubbleColor
    );
    if (bubbleColor === "custom" && useCustomColors) {
      return {
        id: "custom",
        label: "Custom Colors",
        userColor: "",
        aiColor: "",
      };
    }
    return selectedTheme || bubbleColors[0];
  };

  const getBubbleStyle = (sender: "user" | "ai") => {
    if (bubbleColor === "custom" && useCustomColors) {
      return {
        backgroundColor:
          sender === "user" ? customUserBubbleColor : customAiBubbleColor,
      };
    }
    return {};
  };
  return (
    <div className={cn("h-full flex flex-col", className)}>
      <ChatHeader
        persona={selectedPersona}
        currentPersona={currentPersona}
        status="Online"
        exportChat={exportChat}
        clearChat={clearChat}
        setShowBgPicker={setShowBgPicker}
      />
      {/* Background Picker Dialog */}
      <Dialog open={showBgPicker} onOpenChange={setShowBgPicker}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Chat Customization
            </DialogTitle>
            <DialogDescription>
              Customize your chat interface background and message bubble
              colors.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {" "}
            {/* Preset Colors Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Preset Colors
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {backgrounds
                  .filter((bg) => bg.type === "color" && bg.id !== "custom")
                  .map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      className={cn(
                        "relative w-full aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        background === bg.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ background: bg.value }}
                      onClick={() => {
                        setBackground(bg.id);
                        setUseCustomColors(false);
                        setShowBgPicker(false);
                      }}
                      title={bg.label}
                    >
                      {background === bg.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>{" "}
            {/* Custom Color Picker Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Custom Background Color
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label htmlFor="bg-color-picker" className="sr-only">
                    Pick background color
                  </label>
                  <input
                    id="bg-color-picker"
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                    title="Pick a custom background color"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="bg-color-text"
                      className="text-sm text-foreground/80"
                    >
                      Background Color
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="bg-color-text"
                        type="text"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-mono bg-background border border-border rounded-md"
                        placeholder="#ffffff"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBackground("custom");
                          setUseCustomColors(true);
                          setShowBgPicker(false);
                        }}
                        className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                {/* Quick Color Palette */}
                <div>
                  <span className="text-xs text-foreground/60 mb-2 block">
                    Quick Colors
                  </span>
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      "#ffffff",
                      "#f8fafc",
                      "#e2e8f0",
                      "#cbd5e1",
                      "#94a3b8",
                      "#64748b",
                      "#475569",
                      "#334155",
                      "#fee2e2",
                      "#fecaca",
                      "#f87171",
                      "#ef4444",
                      "#fef3c7",
                      "#fde68a",
                      "#f59e0b",
                      "#d97706",
                      "#dcfce7",
                      "#bbf7d0",
                      "#22c55e",
                      "#16a34a",
                      "#dbeafe",
                      "#93c5fd",
                      "#3b82f6",
                      "#2563eb",
                      "#ede9fe",
                      "#c4b5fd",
                      "#8b5cf6",
                      "#7c3aed",
                      "#fce7f3",
                      "#f9a8d4",
                      "#ec4899",
                      "#db2777",
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCustomBgColor(color)}
                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Preset Images Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Patterns & Textures
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {backgrounds
                  .filter((bg) => bg.type === "image" && bg.id !== "uploaded")
                  .map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      className={cn(
                        "relative w-full aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 overflow-hidden",
                        background === bg.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{
                        backgroundImage: bg.value,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={() => {
                        setBackground(bg.id);
                        setShowBgPicker(false);
                      }}
                      title={bg.label}
                    >
                      {background === bg.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
            {/* Custom Upload Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Custom Image
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {uploadedBg && (
                  <button
                    type="button"
                    className={cn(
                      "relative w-full aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-105 overflow-hidden",
                      background === "uploaded"
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    style={{
                      backgroundImage: `url('${uploadedBg}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      setBackground("uploaded");
                      setShowBgPicker(false);
                    }}
                    title="Your uploaded image"
                  >
                    {background === "uploaded" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </button>
                )}

                <button
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 border-dashed transition-all duration-200 hover:scale-105",
                    "flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary"
                  )}
                  onClick={handleUploadClick}
                  title="Upload your own background image"
                  type="button"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs font-medium">Upload</span>
                </button>
              </div>{" "}
              {uploadedBg && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Custom background uploaded successfully
                </p>
              )}
            </div>
            {/* Background Opacity Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Background Transparency
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="bg-opacity"
                    className="text-sm text-foreground/80"
                  >
                    Background Opacity
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(bgOpacity * 100)}%
                  </span>
                </div>
                <input
                  id="bg-opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgOpacity}
                  onChange={(e) =>
                    setBgOpacity(Number.parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>{" "}
            {/* Chat Bubble Colors Section */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">
                Message Bubble Colors
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {bubbleColors
                  .filter((color) => color.id !== "custom")
                  .map((color) => (
                    <button
                      type="button"
                      key={color.id}
                      className={cn(
                        "relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        bubbleColor === color.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => {
                        setBubbleColor(color.id);
                        setUseCustomColors(false);
                      }}
                      title={color.label}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn("w-4 h-4 rounded", color.userColor)}
                        />
                        <span className="text-xs font-medium">You</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded", color.aiColor)} />
                        <span className="text-xs font-medium">AI</span>
                      </div>
                      {bubbleColor === color.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
              </div>

              {/* Custom Bubble Colors */}
              <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/20">
                <h5 className="text-sm font-medium text-foreground">
                  Custom Bubble Colors
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="user-bubble-color"
                      className="text-xs text-foreground/80 mb-1 block"
                    >
                      Your Messages
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="user-bubble-color"
                        type="color"
                        value={customUserBubbleColor}
                        onChange={(e) =>
                          setCustomUserBubbleColor(e.target.value)
                        }
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customUserBubbleColor}
                        onChange={(e) =>
                          setCustomUserBubbleColor(e.target.value)
                        }
                        className="flex-1 px-2 py-1 text-xs font-mono bg-background border border-border rounded"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="ai-bubble-color"
                      className="text-xs text-foreground/80 mb-1 block"
                    >
                      AI Messages
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="ai-bubble-color"
                        type="color"
                        value={customAiBubbleColor}
                        onChange={(e) => setCustomAiBubbleColor(e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customAiBubbleColor}
                        onChange={(e) => setCustomAiBubbleColor(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs font-mono bg-background border border-border rounded"
                        placeholder="#f1f5f9"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBubbleColor("custom");
                    setUseCustomColors(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {" "}
                  Apply Custom Bubble Colors
                </button>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBackground("default");
                  setBgOpacity(1);
                  setBubbleColor("default");
                  setUploadedBg(null);
                  setCustomBgColor("#ffffff");
                  setCustomUserBubbleColor("#3b82f6");
                  setCustomAiBubbleColor("#f1f5f9");
                  setUseCustomColors(false);
                }}
                className="flex-1 text-xs"
              >
                Reset to Default
              </Button>
              <Button
                size="sm"
                onClick={() => setShowBgPicker(false)}
                className="flex-1 text-xs"
              >
                Apply Changes
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>

      <div
        className="flex flex-col flex-1 overflow-y-auto max-w-3xl w-full mx-auto bg-cover bg-center bg-no-repeat pb-52"
        style={getBackgroundStyle()}
      >
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
                        ? `max-w-[85%] ${
                            bubbleColor === "custom" && useCustomColors
                              ? ""
                              : getBubbleColors().userColor
                          } text-white ml-12`
                        : `w-full ${
                            bubbleColor === "custom" && useCustomColors
                              ? ""
                              : getBubbleColors().aiColor
                          } text-foreground`
                    )}
                    style={getBubbleStyle(
                      message.sender === "user" ? "user" : "ai"
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
  setShowBgPicker,
}: {
  persona: string;
  currentPersona: Persona;
  status?: string;
  exportChat: () => void;
  clearChat: () => void;
  setShowBgPicker: (show: boolean) => void;
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
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 text-xs font-mono hover:bg-primary/10"
          title="Change Chat Background"
          onClick={() => setShowBgPicker(true)}
        >
          <ImageIcon className="w-4 h-4" />
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
