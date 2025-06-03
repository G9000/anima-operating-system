export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  persona?: string;
}

export interface Persona {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type ChatMode = "chat" | "roleplay" | "journal" | "story" | "assist" | "silent";

export interface ChatModeConfig {
  id: ChatMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface ChatInterfaceProps {
  className?: string;
  threadId?: string;
}
