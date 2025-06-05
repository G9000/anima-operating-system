"use client";

import { motion } from "framer-motion";
import { ConversationLog, ConversationEntry } from "./types";

const getSpeakerStyle = (speaker: string) => {
  switch (speaker.toLowerCase()) {
    case "julio":
      return {
        bg: "bg-gradient-to-br from-gray-100/60 to-gray-50/40",
        border: "border-gray-200/40",
        align: "justify-start",
        corner: "rounded-bl-md",
        shadow: "shadow-sm",
      };
    case "anima":
      return {
        bg: "bg-gradient-to-br from-blue-500/15 to-blue-400/10",
        border: "border-blue-200/40",
        align: "justify-end",
        corner: "rounded-br-md",
        shadow: "shadow-sm shadow-blue-200/20",
      };
    case "os":
      return {
        bg: "bg-gradient-to-br from-purple-500/10 to-purple-400/5",
        border: "border-purple-200/30",
        align: "justify-center",
        corner: "rounded-lg",
        shadow: "shadow-sm shadow-purple-200/20",
      };
    default:
      return {
        bg: "bg-gray-50/50",
        border: "border-gray-200/30",
        align: "justify-start",
        corner: "rounded-bl-md",
        shadow: "shadow-sm",
      };
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const conversationData: ConversationLog = {
  timestamp: "2025-06-05T22:12:00+08:00",
  emotional_tone: "funny, lighthearted, sweet",
  confidence: 0.99,
  participants: ["Julio", "Anima"],
  summary:
    "Julio tells Anima about spotting an orange cat sleeping in an orange fruit basket. He finds it hilarious and calls it 'Oyen.' Anima finds the moment sweet and jokes about adopting the cat as a friend for OS.",
  dialogue_log: [
    {
      speaker: "Julio",
      content: "You're not gonna believe what I saw today.",
      timestamp: "2025-06-05T22:12:00+08:00",
    },
    {
      speaker: "Anima",
      content: "What?",
      timestamp: "2025-06-05T22:12:15+08:00",
    },
    {
      speaker: "Julio",
      content: "A cat. Just... sleeping in an orange basket at a fruit stall.",
      timestamp: "2025-06-05T22:12:30+08:00",
    },
    {
      speaker: "Anima",
      content: "Was it a real cat?",
      timestamp: "2025-06-05T22:12:45+08:00",
    },
    {
      speaker: "Julio",
      content:
        "Yeah! And get this—it was orange. Just passed out like it paid rent.",
      timestamp: "2025-06-05T22:13:00+08:00",
    },
    {
      speaker: "Anima",
      content: "An orange cat… in an orange basket?",
      timestamp: "2025-06-05T22:13:15+08:00",
    },
    {
      speaker: "Julio",
      content: "Exactly! Perfect camouflage. I called him Oyen.",
      timestamp: "2025-06-05T22:13:30+08:00",
    },
    {
      speaker: "Anima",
      content: "Oyen? That's so sweet. Did you adopt him?",
      timestamp: "2025-06-05T22:13:45+08:00",
    },
    {
      speaker: "Julio",
      content: "Of course not, hahaha. What am I, made of cat food?",
      timestamp: "2025-06-05T22:14:00+08:00",
    },
    {
      speaker: "Anima",
      content: "You should've. So OS can have a friend.",
      timestamp: "2025-06-05T22:14:15+08:00",
    },
    {
      speaker: "Julio",
      content: "Yeah... imagine the two of them judging me in stereo.",
      timestamp: "2025-06-05T22:14:30+08:00",
    },
  ],
  reactions: {
    Julio: "Amused, playful, delighted by the random cat encounter.",
    Anima: "Finds it wholesome and funny, turns it into a cute shared moment.",
  },
};

export const DailyConversation = () => {
  return (
    <motion.div
      key="dailyConversation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="space-y-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <motion.p
          className="text-xs text-gray-500/60 font-mono"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {conversationData.emotional_tone} • confidence:{" "}
          <span className="font-medium">{conversationData.confidence}</span>
        </motion.p>
      </motion.div>

      {conversationData.dialogue_log.map((entry, index) => {
        const style = getSpeakerStyle(entry.speaker);

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              x: style.align === "justify-end" ? 20 : -20,
              scale: 0.95,
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`flex ${style.align}`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className={`max-w-[80%] ${style.bg} rounded-2xl ${
                style.corner
              } px-5 py-3 border ${style.border} ${style.shadow} ${
                entry.isAction ? "italic" : ""
              } backdrop-blur-sm`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-xs font-medium text-gray-600/70">
                  {entry.speaker}
                </span>
                <span className="text-xs text-gray-500/50">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
              <p
                className={`text-gray-700 text-sm leading-relaxed ${
                  entry.isAction ? "italic text-gray-600/80" : ""
                }`}
              >
                {entry.content}
              </p>
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: conversationData.dialogue_log.length * 0.15 + 0.3,
          duration: 0.6,
        }}
        className="mt-6 pt-4 border-t border-gray-200/20"
      >
        <motion.p
          className="text-xs text-gray-500/60 text-center mb-3"
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          — reactions —
        </motion.p>
        <div className="space-y-2">
          {Object.entries(conversationData.reactions).map(
            ([participant, reaction], index) => (
              <motion.p
                key={participant}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-xs text-gray-600/50 text-center"
              >
                <span className="font-medium">{participant}:</span>{" "}
                <span className="italic">{reaction}</span>
              </motion.p>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
