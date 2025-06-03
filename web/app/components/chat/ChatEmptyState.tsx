"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/base";
import { Persona } from "./types";

interface ChatEmptyStateProps {
  construct: Persona;
}

export const ChatEmptyState = ({ construct }: ChatEmptyStateProps) => {
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
