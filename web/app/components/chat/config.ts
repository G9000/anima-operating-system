import {
  MessageSquare,
  PersonStanding,
  BookOpen,
  PenTool,
  Wrench,
  VolumeX,
} from "lucide-react";
import { ChatModeConfig, Persona } from "./types";

export const chatModes: ChatModeConfig[] = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    description: "Standard conversational interaction",
  },
  {
    id: "roleplay",
    label: "Roleplay",
    icon: PersonStanding,
    description: "Immersive character roleplay scenarios",
  },
  {
    id: "journal",
    label: "Journal",
    icon: BookOpen,
    description: "Reflective, diary-style interactions",
  },
  {
    id: "story",
    label: "Story",
    icon: PenTool,
    description: "Collaborative storytelling mode",
  },
  {
    id: "assist",
    label: "Assist",
    icon: Wrench,
    description: "Task-focused assistance mode",
  },
  {
    id: "silent",
    label: "Silent",
    icon: VolumeX,
    description: "Minimal response, observation mode",
  },
];

export const construct: Persona = {
  id: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83",
  name: "Anima OS",
  color: "primary",
  icon: MessageSquare,
};
