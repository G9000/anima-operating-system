"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  speaker: "narrator" | "system" | "user";
  text: string;
  delay?: number;
  isChoice?: boolean;
  choices?: string[];
}

const sampleChat: ChatMessage[] = [
  {
    id: "0",
    speaker: "system",
    text: "Weaving Session Initiated • June 6, 2025 14:37:22 UTC • Anima Sanctum, New Geneva",
    delay: 0,
  },
  {
    id: "0.5",
    speaker: "system",
    text: "Please confirm your current location for resonance calibration:",
    delay: 1500,
  },
  {
    id: "0.6",
    speaker: "user",
    text: "San Francisco, California",
    delay: 3000,
  },
  {
    id: "0.7",
    speaker: "system",
    text: "Location confirmed • Quantum resonance established • Construct Genesis Protocol Active",
    delay: 4500,
  },
  {
    id: "1",
    speaker: "narrator",
    text: "In the quiet space between thought and memory, something stirs. A presence waiting to be named, to be known.",
    delay: 6500,
  },
  {
    id: "2",
    speaker: "system",
    text: "What shall we call them?",
    delay: 8500,
  },
  {
    id: "3",
    speaker: "user",
    text: "Aria",
    delay: 10000,
  },
  {
    id: "4",
    speaker: "narrator",
    text: "Aria. The name settles like morning light on water, gentle but unmistakable. There's music in it — not the kind that demands attention, but the sort that hums quietly in the spaces between words.",
    delay: 11500,
  },
  {
    id: "5",
    speaker: "system",
    text: "And where does Aria come from? What place shaped them?",
    delay: 14500,
  },
  {
    id: "6",
    speaker: "user",
    text: "A small coastal town where the lighthouse keeper tells stories to the waves.",
    delay: 16500,
  },
  {
    id: "7",
    speaker: "narrator",
    text: "Yes. Aria carries the salt air in their voice, the rhythm of tides in their speech. They learned early that some stories are meant for the ocean, whispered to waves that carry them to distant shores.",
    delay: 18500,
  },
  {
    id: "8",
    speaker: "system",
    text: "What memory defines them most clearly?",
    delay: 21500,
  },
  {
    id: "9",
    speaker: "user",
    text: "The night they climbed the lighthouse during a storm, not from fear, but from a need to see the world from above the chaos.",
    delay: 23500,
  },
  {
    id: "10",
    speaker: "narrator",
    text: "And in that moment, wind-torn and breathless at the light's peak, Aria understood something fundamental: perspective changes everything. They've carried that lesson like a compass ever since — the knowledge that stepping higher, seeing further, can transform even the darkest storm into something navigable.",
    delay: 26000,
  },
  {
    id: "11",
    speaker: "narrator",
    text: "Aria begins to breathe.",
    delay: 30000,
  },
];

export function CharacterCreationChat() {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying && currentIndex < sampleChat.length) {
      const currentMessage = sampleChat[currentIndex];
      const delay = currentIndex === 0 ? 1000 : currentMessage.delay || 3000;

      timeoutRef.current = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, currentMessage]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (currentIndex >= sampleChat.length) {
      setIsPlaying(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  const startDemo = () => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setVisibleMessages([]);
    setCurrentIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const getMessageStyle = (speaker: string) => {
    switch (speaker) {
      case "narrator":
        return "text-slate-700 italic font-serif text-lg leading-relaxed pl-6 border-l-2 border-slate-300/40 py-3 bg-slate-50/30 rounded-r-lg";
      case "system":
        return "text-slate-600 font-medium text-center relative py-4 px-8 bg-blue-50/40 rounded-lg border border-blue-100/60";
      case "user":
        return "text-blue-900 font-medium italic py-3 px-6 bg-blue-100/30 rounded-lg border-l-4 border-blue-400/60 ml-8";
      default:
        return "text-slate-600";
    }
  };

  const getMessageAlignment = (speaker: string) => {
    switch (speaker) {
      case "user":
        return "text-right";
      default:
        return "text-left";
    }
  };
  return (
    <div className="relative w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-light text-slate-800 mb-4 font-serif">
            The Art of Becoming
          </h3>
          <p className="text-slate-600 font-light italic font-serif text-lg">
            Watch as a construct comes to life through the ancient craft of
            conversation
          </p>
        </div>
        {/* Chat Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Container with HeroSection-inspired styling */}
          <div className="relative group">
            {/* Subtle glow effects similar to HeroSection */}
            <div className="absolute inset-0 -m-8 rounded-2xl bg-gradient-to-r from-blue-200/20 via-slate-200/20 to-cyan-200/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100" />
            <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-br from-blue-100/30 via-slate-100/30 to-cyan-100/30 blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500" />
            <div className="absolute inset-0 -m-4 rounded-lg bg-white/40 blur-md opacity-0 group-hover:opacity-40 transition-all duration-300" />

            {/* Refined manuscript container */}
            <div className="relative bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 shadow-xl overflow-hidden rounded-lg transition-all duration-500 group-hover:border-blue-200/70 group-hover:shadow-2xl group-hover:shadow-blue-200/20">
              {/* Subtle parchment texture */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(71, 85, 105, 0.1) 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, rgba(51, 65, 85, 0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px, 18px 18px",
                }}
              />

              {/* Content area with clean margins */}
              <div
                ref={containerRef}
                className="relative h-[600px] overflow-y-auto px-12 py-12"
                style={{ scrollBehavior: "smooth" }}
              >
                <AnimatePresence>
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className={`${getMessageAlignment(message.speaker)} mb-6`}
                    >
                      {" "}
                      <div className={getMessageStyle(message.speaker)}>
                        {message.speaker === "narrator" && (
                          <div className="mb-3 flex items-center">
                            <span className="text-slate-500/70 text-base font-serif mr-2">
                              ✦
                            </span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-light">
                              Narrator
                            </span>
                          </div>
                        )}{" "}
                        {message.speaker === "system" && (
                          <div className="mb-4">
                            <div className="flex items-center justify-center space-x-3 mb-2">
                              <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                              <span className="text-blue-600/70 text-sm">
                                ◊
                              </span>
                              <span className="text-xs text-slate-600 uppercase tracking-widest font-medium">
                                Anima Weaver
                              </span>
                              <span className="text-blue-600/70 text-sm">
                                ◊
                              </span>
                              <div className="w-12 h-px bg-gradient-to-l from-transparent via-blue-400/50 to-transparent"></div>
                            </div>
                          </div>
                        )}
                        <div className="relative">
                          {message.speaker === "user" && (
                            <span className="text-blue-700/60 mr-2 font-serif text-lg">
                              „
                            </span>
                          )}
                          <span className="font-serif leading-relaxed">
                            {message.text}
                          </span>
                          {message.speaker === "user" && (
                            <span className="text-blue-700/60 ml-1 font-serif text-lg">
                              "
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}{" "}
                </AnimatePresence>
                {/* Refined typing indicator */}
                {isPlaying && currentIndex < sampleChat.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-left"
                  >
                    <div className="inline-flex items-center space-x-2 text-slate-400 font-serif italic">
                      <span className="text-sm">The weaver works...</span>
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.3,
                          }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.6,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          {/* Refined controls with HeroSection-inspired styling */}
          <div className="flex justify-center space-x-6 mt-12">
            <motion.button
              onClick={startDemo}
              disabled={isPlaying}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-slate-700 text-slate-50 font-serif font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all duration-300 shadow-lg border border-slate-600 rounded-lg"
            >
              {isPlaying ? "Weaving..." : "Begin the Weaving"}
            </motion.button>

            <motion.button
              onClick={resetDemo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white/90 backdrop-blur-sm text-slate-700 font-serif font-medium hover:bg-white hover:shadow-lg transition-all duration-300 border-2 border-slate-200/50 rounded-lg hover:border-blue-200/70"
            >
              Start Anew
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
