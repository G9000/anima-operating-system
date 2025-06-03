"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/base";
import { Persona } from "./types";

interface ChatHeaderAvatarProps {
  persona: Persona;
}

export const ChatHeaderAvatar = ({ persona }: ChatHeaderAvatarProps) => {
  return (
    <Avatar className="size-10">
      <AvatarImage src="/animaos.webp" alt="avatar" />
      <AvatarFallback className="text-primary-foreground">
        {persona.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
