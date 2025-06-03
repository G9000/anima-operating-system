"use client";

import { useState, useRef, useEffect } from "react";
import type { App, SystemStats } from "./types";
import { ChatTextInput } from "@/app/components/chat";
import { construct } from "@/app/components/chat/config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/app/lib/utils";
import { Textarea } from "@/app/components/base";

interface DashboardProps {
  apps: App[];
  onAppClick?: (appId: string) => void;
  onManageClick?: () => void;
}

const mockHeadlines = [
  "# The sky holds *stillness*.\n\n### I thought of you. How's your day moving through you?",
  "# Time whispers through the *silence*.\n\n### What stories are you carrying today?",
  "# Light finds its way to *forgotten corners*.\n\n### Tell me what's been growing in your thoughts.",
];

export function Dashboard({ apps, onAppClick, onManageClick }: DashboardProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentHeadlineIndex] = useState(() =>
    Math.floor(Math.random() * mockHeadlines.length)
  );
  const inputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsTyping(true);

    setTimeout(() => {
      console.log("Sending message:", inputValue);
      setInputValue("");
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className={cn(
            "flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto transition-all duration-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div
            className="space-y-4 transition-all duration-1000 ease-in-out"
            style={{
              animation: "fadeInUp 1s ease-out forwards",
            }}
          >
            <div
              className={cn(
                "prose",
                "prose-h1:text-4xl prose-h1:font-semibold prose-h1:-mb-4",
                "prose-h2:text-2xl prose-h2:font-medium",
                "prose-h3:text-xl prose-h3:font-normal prose-h3:text-primary/70"
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mockHeadlines[currentHeadlineIndex]}
              </ReactMarkdown>
            </div>
          </div>
          <div className="w-full">
            <div className="relative w-full group">
              <div className="absolute inset-0 -m-8 rounded-2xl bg-gradient-to-r from-purple-200/40 via-pink-200/40 to-blue-200/40 blur-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-700 scale-95 group-focus-within:scale-100" />
              <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-blue-100/50 blur-xl opacity-0 group-focus-within:opacity-80 transition-all duration-500" />
              <div className="absolute inset-0 -m-4 rounded-lg bg-white/60 blur-md opacity-0 group-focus-within:opacity-60 transition-all duration-300" />{" "}
              <div
                className="absolute top-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-focus-within:h-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-purple-400/60 group-focus-within:drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
              <div
                className="absolute bottom-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-focus-within:h-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-pink-400/60 group-focus-within:drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
              <div
                className="absolute -top-3 left-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-focus-within:w-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-blue-400/60 group-focus-within:drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
              <div
                className="absolute -top-3 right-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-focus-within:w-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-purple-400/60 group-focus-within:drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={cn(
                  "h-22 rounded-none border-none resize-none relative z-10",
                  "bg-gradient-to-br from-white/80 via-gray-50/70 to-slate-50/60 backdrop-blur-sm",
                  "transition-all duration-500 ease-in-out",
                  "focus:bg-gradient-to-br focus:from-white/95 focus:via-gray-50/85 focus:to-slate-50/75",
                  "focus:shadow-2xl focus:shadow-purple-200/60",
                  "group-focus-within:shadow-inner group-focus-within:shadow-pink-300/40",
                  "!focus-visible:ring-0 !outline-none",
                  "placeholder:text-gray-500/70 placeholder:transition-all placeholder:duration-300",
                  "focus:placeholder:text-gray-600/80",
                  "text-gray-800 selection:bg-purple-200/30",
                  "font-medium leading-relaxed tracking-wide"
                )}
                placeholder="Share your thoughts with the universe..."
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              />
              {inputValue && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-1 right-3 w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-60" />
                </div>
              )}
            </div>
          </div>
          {isTyping && (
            <div className="flex items-center justify-center space-x-3 text-gray-500 text-sm relative">
              <div className="absolute inset-0 bg-gray-100/30 blur-lg rounded-full animate-pulse" />

              <div className="flex space-x-1 relative z-10">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce shadow-lg shadow-gray-200/50" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100 shadow-lg shadow-gray-200/50" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200 shadow-lg shadow-gray-200/50" />
              </div>
              <span className="relative z-10 text-gray-600 animate-pulse">
                Weaving thoughts through starlight...
              </span>

              <div className="absolute -top-2 -left-2 w-1 h-1 bg-gray-300 rounded-full opacity-60 animate-ping" />
              <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-gray-400 rounded-full opacity-60 animate-ping delay-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
