"use client";

import { Button } from "@/app/components/base";
import { cn } from "@/app/lib/utils";
import { ChatMode, ChatModeConfig } from "./types";
import { chatModes } from "./config";

interface ChatModeSelectorProps {
  chatMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  layout?: "horizontal" | "grid";
}

export const ChatModeSelector = ({
  chatMode,
  onModeChange,
  layout = "horizontal",
}: ChatModeSelectorProps) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
          : "flex-wrap justify-center"
      )}
    >
      {chatModes.map((mode) => {
        const isActive = chatMode === mode.id;

        return (
          <Button
            key={mode.id}
            variant={isActive ? "default" : "outline"}
            size="lg"
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "text-xs flex items-center gap-2 transition-all duration-200 rounded-2xl font-sans"
            )}
            title={mode.description}
          >
            {mode.label}
          </Button>
        );
      })}
    </div>
  );
};
