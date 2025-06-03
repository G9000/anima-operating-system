"use client";

import { cn } from "@/app/lib/utils";
import { Message } from "./types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatMessageBubbleProps {
  message: Message;
  streamingMessageId: string | null;
}

export const ChatMessageBubble = ({
  message,
  streamingMessageId,
}: ChatMessageBubbleProps) => {
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
