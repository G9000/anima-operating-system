"use client";

import { cn } from "@/app/lib/utils";

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  time: string;
  isTyping?: boolean;
}

export function ChatMessage({
  isUser,
  message,
  time,
  isTyping = false,
}: ChatMessageProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn("relative max-w-[85%] group", isUser ? "ml-8" : "mr-8")}
      >
        {/* Elegant message bubble */}
        <div
          className="absolute inset-0 -m-1 bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-all duration-300 blur-sm rounded-3xl"
          style={{
            background: isUser
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))"
              : "linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(209, 213, 219, 0.2))",
          }}
        />
        <div
          className={cn(
            "relative rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl",
            isUser
              ? "bg-gradient-to-br from-blue-500/90 to-indigo-600/90 text-white border-blue-300/20 rounded-br-lg"
              : "bg-white/95 text-primary/90 border-gray-200/40 rounded-bl-lg"
          )}
        >
          <p className="leading-relaxed font-light text-[15px]">{message}</p>
          <div
            className={cn(
              "text-xs mt-3 opacity-60 font-light",
              isUser ? "text-blue-100" : "text-primary/50"
            )}
          >
            {time}
            {isTyping && !isUser && (
              <span className="ml-3 inline-flex items-center">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200"></div>
                </div>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="relative group">
      {/* Elegant background effects */}
      <div className="absolute inset-0 -m-3 bg-gradient-to-br from-blue-100/20 via-indigo-100/20 to-purple-100/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="absolute inset-0 -m-1 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 blur-md rounded-xl opacity-0 group-hover:opacity-60 transition-all duration-500" />

      <div className="relative flex items-start space-x-5 p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/85 hover:border-gray-300/50">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 -m-2 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-blue-100/50 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <h4 className="font-medium text-primary/90 text-xl font-serif tracking-wide group-hover:text-primary transition-colors duration-300">
            {title}
          </h4>
          <p className="text-primary/60 leading-relaxed font-light text-[15px] group-hover:text-primary/70 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
