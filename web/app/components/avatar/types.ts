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
  // Optional fields
  alias?: string;
  tags?: string[];
  archetype?: string;
  archetypeTraits?: string[];
  gender?: string;
  age?: string;
  species?: string;
  birthday?: string;
  birthplace?: string;
  height?: string;
  weight?: string;
  personalitySummary?: string;
  coreValues?: string[];
  fears?: string[];
  desires?: string[];
  beliefs?: string[];
  behaviorArc?: string;
  refusalStyle?: string;
  triggerToHelp?: string;
  mannerisms?: string[];
  quirks?: string[];
  speechTones?: string[];
  speechStyle?: string;
  accent?: string;
  backstory?: string;
  definingMoments?: string[];
  occupation?: string;
  hobbies?: string[];
  interests?: string[];
  favoriteFoods?: string[];
  dislikes?: string[];
  dailyRoutine?: string;
  psychologicalTraits?: string[];
}
