export interface Construct {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  capabilities: string[];
  systemAccess: string[];
  status: "active" | "idle" | "offline";
  lastUsed: string;
  trustLevel: "basic" | "trusted" | "full"; // System access level
  canControlOS: boolean; // Can control Anima OS directly
  personalityTraits: string[]; // Friend-like traits
  favoriteActivities: string[]; // What they enjoy doing
  responsibility: string; // Primary responsibility or purpose
}

export interface CreateConstructData {
  name: string;
  role: string;
  description: string;
  avatar: string;
  capabilities: string[];
  systemAccess: string[];
  trustLevel: "basic" | "trusted" | "full";
  canControlOS: boolean;
  personalityTraits: string[];
  favoriteActivities: string[];
}
