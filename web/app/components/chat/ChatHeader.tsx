"use client";

import { Download, FileText, MessageSquare, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/base";
import { cn } from "@/app/lib/utils";
import { ChatMode, Persona } from "./types";
import { chatModes } from "./config";
import { ChatHeaderAvatar } from "./ChatHeaderAvatar";

interface ChatHeaderProps {
  persona: string;
  currentPersona: Persona;
  status?: string;
  exportChat: () => void;
  clearChat: () => void;
  chatMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  summarizeChat: () => void;
  isSummarizing: boolean;
}

export const ChatHeader = ({
  persona,
  currentPersona,
  status,
  exportChat,
  clearChat,
  chatMode,
  onModeChange,
  summarizeChat,
  isSummarizing,
}: ChatHeaderProps) => {
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
                    <span className="font-medium">{currentMode?.label}</span>
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
                  <div>
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {mode.description}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
