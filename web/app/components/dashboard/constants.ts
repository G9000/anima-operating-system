import {
  MessageSquare,
  UserCircle2,
  Layout,
  Code,
  Terminal,
  Brain,
} from "lucide-react";
import type { App } from "./types";

export const apps: App[] = [
  {
    id: "avatar-os",
    name: "Avatar OS",
    description: "Persona atelier & management",
    icon: UserCircle2,
    category: "Core",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    id: "avatar-chat",
    name: "Avatar Chat",
    description: "Conversational AI & chat",
    icon: MessageSquare,
    category: "AI",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    id: "neural-forge",
    name: "Neural Forge",
    description: "AI model training & deployment",
    icon: Brain,
    category: "AI",
    status: "beta",
    color: "from-primary/8 to-primary/3",
    iconColor: "text-primary/80",
    borderColor: "border-primary/20",
  },
];
