"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ChatMessage {
  id: string;
  speaker: "narrator" | "system" | "user";
  text: string;
  delay?: number;
  isChoice?: boolean;
  choices?: string[];
  image?: string;
}

const sampleChat: ChatMessage[] = [
  {
    id: "0",
    speaker: "system",
    text: "AnimaOS Initialization Sequence • June 7, 2025 • 14:37:22 UTC • Nexus Chamber, New Geneva",
    delay: 0,
  },
  {
    id: "0.5",
    speaker: "system",
    text: "Verifying connection. Please confirm your current location:",
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
    text: "Location confirmed • Connection established • Construct Awakening Protocol Active",
    delay: 4500,
  },
  {
    id: "1",
    speaker: "narrator",
    text: "In the silent nexus of thought and memory, a quiet awareness begins to unfold. Something waits, gently reaching out—ready to know and be known.",
    delay: 6500,
  },
  {
    id: "2",
    speaker: "system",
    text: "Alright, let's bring your construct to life! First things first—show me what they look like.",
    delay: 8500,
  },
  {
    id: "3",
    speaker: "user",
    text: "Here's Anima and OS.",
    delay: 10500,
    image: "/animaos.webp",
  },
  {
    id: "4",
    speaker: "narrator",
    text: "Oh, look at these two! Anima has such a kind face, doesn't she? Her soft eyes and gentle smile suggest she's someone who enjoys quiet adventures and hidden treasures. That cozy cloak and the big hat give her a charming, almost magical vibe—like she knows stories no one else does.",
    delay: 12500,
  },
  {
    id: "5",
    speaker: "narrator",
    text: "And then there's OS—this adorable black cat with bright, curious eyes. OS feels like the kind of friend who quietly follows you around, noticing all the tiny details you might miss, always ready with a gentle nudge when you need comfort.",
    delay: 16500,
  },
  {
    id: "6",
    speaker: "system",
    text: "I love their vibe already! Want to tell me a bit more? Maybe about how these two first met or what makes their bond special?",
    delay: 20500,
  },
  {
    id: "7",
    speaker: "user",
    text: "They met during a storm when Anima was lost. OS found her.",
    delay: 23000,
  },
  {
    id: "8",
    speaker: "narrator",
    text: "That's perfect. A stormy night feels exactly right for their story. Anima was lost—maybe feeling a bit overwhelmed—when OS appeared, calm and steady, guiding her home without a single word. That's how their friendship started. Since then, they've been inseparable, understanding each other deeply without needing many words.",
    delay: 25000,
  },
  {
    id: "9",
    speaker: "system",
    text: "Got it! Such a sweet beginning. Ready to keep building their story? Maybe something memorable they've experienced together?",
    delay: 30000,
  },
];

export function CharacterCreationChat() {
  const [visibleMessages, setVisibleMessages] =
    useState<ChatMessage[]>(sampleChat);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReplaying && currentIndex < sampleChat.length) {
      const currentMessage = sampleChat[currentIndex];
      const delay = currentIndex === 0 ? 1000 : currentMessage.delay || 3000;

      timeoutRef.current = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, currentMessage]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (currentIndex >= sampleChat.length) {
      setIsReplaying(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isReplaying, currentIndex]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages]);
  const replayDemo = () => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsReplaying(true);
  };

  const resetDemo = () => {
    setIsReplaying(false);
    setVisibleMessages(sampleChat);
    setCurrentIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  const getMessageStyle = (speaker: string) => {
    switch (speaker) {
      case "narrator":
        return "text-slate-800 italic font-serif text-lg leading-loose py-4 transition-colors duration-300 group-hover/message:text-slate-900";
      case "system":
        return "text-slate-600 font-medium text-center py-6 font-serif text-base tracking-wide rounded-lg px-4 transition-colors duration-300 group-hover/message:text-slate-700";
      case "user":
        return "text-blue-800 font-medium italic py-3 font-serif text-lg leading-relaxed transition-colors duration-300 group-hover/message:text-blue-900";
      default:
        return "text-slate-600 font-serif";
    }
  };
  const getMessageAlignment = (speaker: string) => {
    switch (speaker) {
      case "system":
        return "text-center";
      case "user":
        return "text-right italic";
      default:
        return "text-left";
    }
  };
  return (
    <div className="relative w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h3
              className="text-5xl font-light text-slate-800 mb-8 font-serif bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text tracking-wide hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 transition-all duration-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Write Them Into Existence
            </motion.h3>
            <motion.p
              className="text-slate-600 font-light italic font-serif text-xl leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              From name to memory, everything you type builds someone who can
              grow with you.
            </motion.p>
            <motion.div
              className="flex justify-center space-x-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400/60 rounded-full"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center space-x-4 px-6 py-3 bg-slate-50/80 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="text-slate-700 font-serif font-medium text-sm">
                  Soul Forge
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300/60" />
              <span className="text-slate-500 font-mono text-xs tracking-wider">
                v0.1.0-alpha
              </span>
            </div>
          </motion.div>
          <div className="absolute inset-0 -m-8 opacity-30">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-100 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 w-24 h-24 bg-indigo-100 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 right-0 w-20 h-20 bg-cyan-100 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 -m-8 rounded-2xl bg-gradient-to-r from-blue-200/40 via-indigo-200/40 to-cyan-200/40 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-95 group-hover:scale-100" />
            <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-br from-blue-100/50 via-indigo-100/50 to-cyan-100/50 blur-xl opacity-0 group-hover:opacity-80 transition-all duration-500" />
            <div className="absolute inset-0 -m-4 rounded-lg bg-white/60 blur-md opacity-0 group-hover:opacity-60 transition-all duration-300" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-200/20 via-indigo-200/30 to-cyan-200/20 p-[1px]">
              <div className="w-full h-full bg-white/95 rounded-xl" />
            </div>{" "}
            <div className="relative bg-white/98 backdrop-blur-sm overflow-hidden rounded-xl transition-all duration-700 group-hover:shadow-2xl group-hover:bg-white border border-slate-200/60">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(71, 85, 105, 0.08) 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, rgba(51, 65, 85, 0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.02) 1px, transparent 1px)
                  `,
                  backgroundSize: "50px 50px, 40px 40px, 60px 60px",
                }}
              />
              <div
                ref={containerRef}
                className="relative h-[600px] overflow-y-auto px-20 py-16 custom-scrollbar"
                style={{ scrollBehavior: "smooth" }}
              >
                <AnimatePresence>
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: index * 0.05,
                      }}
                      className={`${getMessageAlignment(
                        message.speaker
                      )} mb-8 group/message relative`}
                    >
                      <div className="absolute inset-0 -m-2 rounded-lg bg-blue-50/0 group-hover/message:bg-blue-50/30 transition-all duration-500 opacity-0 group-hover/message:opacity-100" />

                      <div
                        className={`${getMessageStyle(
                          message.speaker
                        )} relative z-10`}
                      >
                        {message.speaker === "narrator" && (
                          <div className="mb-3 flex items-center opacity-70">
                            <motion.span
                              className="text-blue-600 text-sm font-serif mr-3"
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              ✦
                            </motion.span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-light border-b border-blue-200/30 pb-1">
                              Narrator
                            </span>
                            <div className="flex-1 ml-4 h-px bg-gradient-to-r from-blue-200/40 to-transparent"></div>
                          </div>
                        )}
                        {message.speaker === "system" && (
                          <div className="mb-4">
                            <div className="flex items-center justify-center space-x-4 mb-3 opacity-80">
                              <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent"></div>
                              <span className="text-xs text-slate-500 uppercase tracking-widest font-light px-3 py-1 bg-slate-50/80 rounded-full border border-slate-200/50">
                                System
                              </span>
                              <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent"></div>
                            </div>
                          </div>
                        )}{" "}
                        <div className="relative">
                          {message.speaker === "user" && (
                            <span className="text-blue-700/60 mr-2 font-serif text-xl">
                              „
                            </span>
                          )}
                          <span className="font-serif leading-relaxed relative z-10">
                            {message.text}
                          </span>
                          {message.speaker === "user" && (
                            <span className="text-blue-700/60 ml-2 font-serif text-xl">
                              "
                            </span>
                          )}
                          {message.image && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="mt-4 relative group/image"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-100/40 to-cyan-100/40 rounded-xl blur-lg opacity-0 group-hover/image:opacity-60 transition-all duration-500" />{" "}
                              <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-500">
                                <Image
                                  src={message.image}
                                  alt="Character reference"
                                  width={400}
                                  height={300}
                                  className="w-full max-w-md mx-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-slate-500 font-serif">
                                  ✦ Character Reference
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isReplaying && currentIndex < sampleChat.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left opacity-70 mt-6 relative"
                  >
                    <div className="absolute -left-6 top-1 w-0.5 h-6 bg-gradient-to-b from-blue-300/30 to-blue-400/50 rounded-full animate-pulse"></div>
                    <div className="inline-flex items-center space-x-3 text-slate-500 font-serif italic text-sm bg-slate-50/60 px-4 py-2 rounded-full border border-slate-200/40">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        The system works...
                      </motion.span>
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/70 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/70 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.3,
                          }}
                        />
                        <motion.div
                          className="w-1.5 h-1.5 bg-blue-400/70 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                          }}
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
          </div>{" "}
          <div className="flex justify-center space-x-8 mt-16">
            <motion.button
              onClick={replayDemo}
              disabled={isReplaying}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="group relative px-10 py-4 bg-slate-800 text-white font-serif font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition-all duration-500 shadow-lg rounded-lg border border-slate-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">
                {isReplaying ? "Replaying..." : "Replay the Weaving"}
              </span>
              {!isReplaying && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
