export interface ConversationEntry {
  speaker: string;
  content: string;
  timestamp: string;
  isAction?: boolean;
}

export interface ConversationLog {
  timestamp: string;
  emotional_tone: string;
  confidence: number;
  participants: string[];
  summary: string;
  dialogue_log: ConversationEntry[];
  reactions: Record<string, string>;
}

export interface TextItem {
  content: string;
  className: string;
  isImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export const PHASE_DURATIONS = {
  dailyConversation: 3000,
  transformation: 2500,
} as const;

export const ANIMATION_PHASES = {
  idle: "idle",
  dailyConversation: "dailyConversation",
  transformation: "transformation",
  memoryWalk: "memoryWalk",
} as const;

export type AnimationPhase = (typeof ANIMATION_PHASES)[keyof typeof ANIMATION_PHASES];

export const ANIMATION_VARIANTS = {
  book: {
    initial: { rotateY: -30, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    hover: { rotateY: 5, transition: { duration: 0.3 } },
  },
  page: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};
