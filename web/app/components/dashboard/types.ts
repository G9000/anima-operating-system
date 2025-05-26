import type { LucideIcon } from "lucide-react";

export interface App {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  status: "active" | "beta" | "coming-soon";
  color: string;
  iconColor: string;
  borderColor: string;
}

export interface SystemStats {
  active: number;
  beta: number;
  pending: number;
}
