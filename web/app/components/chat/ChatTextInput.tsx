"use client";

import { Send } from "lucide-react";
import { Button, Textarea } from "@/app/components/base";
import { cn } from "@/app/lib/utils";
import { ChatMode, Persona } from "./types";
import { ChatModeSelector } from "./ChatModeSelector";

interface ChatTextInputProps {
  construct: Persona;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  streamingMessageId: string | null;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
  showModeSelector?: boolean;
  chatMode?: ChatMode;
  onModeChange?: (mode: ChatMode) => void;
}

export const ChatTextInput = ({
  construct,
  inputValue,
  setInputValue,
  handleSendMessage,
  isTyping,
  streamingMessageId,
  handleKeyPress,
  inputRef,
  className,
  showModeSelector = false,
  chatMode,
  onModeChange,
}: ChatTextInputProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full",
        className
      )}
    >
      <div className="flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative border border-border/20 backdrop-blur-sm rounded-xl">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder={`Message ${construct.name}...`}
              className={cn(
                "h-22 w-full pr-12 py-3 px-4",
                "border border-border/20 rounded-xl",
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
          {showModeSelector && chatMode && onModeChange && (
            <div className="mt-4 flex justify-center">
              <ChatModeSelector
                chatMode={chatMode}
                onModeChange={onModeChange}
                layout="horizontal"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
