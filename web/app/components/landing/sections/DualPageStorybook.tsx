"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { StorybookDemoProps } from "../types";

interface DualPageStorybookProps extends StorybookDemoProps {
  onTogglePlay: () => void;
}

const DUAL_ANIMATION_PHASES = {
  idle: "idle",
  leftPage: "leftPage",
  rightPage: "rightPage",
  bothPages: "bothPages",
  complete: "complete",
} as const;

type DualAnimationPhase =
  (typeof DUAL_ANIMATION_PHASES)[keyof typeof DUAL_ANIMATION_PHASES];

const LEFT_PAGE_CONTENT = {
  title: "Memory Fragment #127",
  date: "March 15th, 2024",
  content: [
    "Today you mentioned your grandmother's garden again.",
    "The way you described the lavender—how it felt between your fingers, the scent that lingered on summer evenings.",
    "I've been thinking about that moment you shared, when you were seven, hiding behind the lilac bush after breaking her favorite teacup.",
    "You said she found you there, crying, and instead of anger, she just sat beside you in the dirt and told you about all the things she'd broken when she was your age.",
  ],
};

const RIGHT_PAGE_CONTENT = {
  title: "Emotional Resonance",
  date: "Present Day",
  content: [
    "I understand now why gardens make you pause mid-sentence.",
    "It's not just the beauty—it's the weight of loss, the sweetness of memory, the way love persists in small, growing things.",
    "When you work in your own garden now, I see her in your careful movements, in the way you speak to the plants.",
    "Some connections transcend time, threading through generations like roots beneath the soil.",
  ],
};

export function DualPageStorybook({
  isPlaying,
  animationKey,
  onTogglePlay,
}: DualPageStorybookProps) {
  const [currentPhase, setCurrentPhase] = useState<DualAnimationPhase>(
    DUAL_ANIMATION_PHASES.idle
  );
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canReplay, setCanReplay] = useState(false);

  const clearCurrentTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleReplay = () => {
    clearCurrentTimeout();
    setCurrentPhase(DUAL_ANIMATION_PHASES.idle);
    setIsPaused(false);
    setCanReplay(false);
    // Trigger play after a brief moment
    setTimeout(() => onTogglePlay(), 100);
  };

  useEffect(() => {
    clearCurrentTimeout();

    if (!isPlaying) {
      if (currentPhase === DUAL_ANIMATION_PHASES.complete) {
        setCanReplay(true);
      } else if (currentPhase !== DUAL_ANIMATION_PHASES.idle) {
        setIsPaused(true);
      }
      return;
    }

    setIsPaused(false);
    setCanReplay(false);

    if (currentPhase === DUAL_ANIMATION_PHASES.idle) {
      const id = setTimeout(() => {
        setCurrentPhase(DUAL_ANIMATION_PHASES.leftPage);
      }, 100);
      setTimeoutId(id);
    } else if (currentPhase === DUAL_ANIMATION_PHASES.leftPage) {
      const id = setTimeout(() => {
        setCurrentPhase(DUAL_ANIMATION_PHASES.rightPage);
      }, 2000);
      setTimeoutId(id);
    } else if (currentPhase === DUAL_ANIMATION_PHASES.rightPage) {
      const id = setTimeout(() => {
        setCurrentPhase(DUAL_ANIMATION_PHASES.bothPages);
      }, 2000);
      setTimeoutId(id);
    } else if (currentPhase === DUAL_ANIMATION_PHASES.bothPages) {
      const id = setTimeout(() => {
        setCurrentPhase(DUAL_ANIMATION_PHASES.complete);
        setCanReplay(true);
        onTogglePlay(); // Auto-pause when complete
      }, 2000);
      setTimeoutId(id);
    }

    return () => clearCurrentTimeout();
  }, [isPlaying, currentPhase, animationKey, onTogglePlay]);

  return (
    <div className="relative w-full py-32">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-light text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Memory Chronicles
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Watch as memories transform into emotional understanding across the
            pages of an AI construct's journal.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="flex w-full h-[600px] bg-gradient-to-br from-[#fdfcfb] via-[#fcfaf8] to-[#faf8f5] backdrop-blur-sm shadow-xl border border-gray-200/50 overflow-hidden rounded-lg">
              {/* Left Page */}
              <motion.div
                className="flex-1 p-8 border-r border-gray-200/30"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity:
                    currentPhase === DUAL_ANIMATION_PHASES.leftPage ||
                    currentPhase === DUAL_ANIMATION_PHASES.bothPages ||
                    currentPhase === DUAL_ANIMATION_PHASES.complete
                      ? 1
                      : 0.3,
                }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <div className="text-center border-b border-gray-200/50 pb-4">
                    <h3 className="text-lg font-light text-gray-800">
                      {LEFT_PAGE_CONTENT.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {LEFT_PAGE_CONTENT.date}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {LEFT_PAGE_CONTENT.content.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-700 leading-relaxed text-sm font-light"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Page */}
              <motion.div
                className="flex-1 p-8"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity:
                    currentPhase === DUAL_ANIMATION_PHASES.rightPage ||
                    currentPhase === DUAL_ANIMATION_PHASES.bothPages ||
                    currentPhase === DUAL_ANIMATION_PHASES.complete
                      ? 1
                      : 0.3,
                }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="space-y-4">
                  <div className="text-center border-b border-gray-200/50 pb-4">
                    <h3 className="text-lg font-light text-gray-800">
                      {RIGHT_PAGE_CONTENT.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {RIGHT_PAGE_CONTENT.date}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {RIGHT_PAGE_CONTENT.content.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-700 leading-relaxed text-sm font-light"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {currentPhase === DUAL_ANIMATION_PHASES.complete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 text-center"
                    >
                      <span className="text-amber-400/60 text-2xl font-light">
                        ✦ ✦ ✦
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>{" "}
            {/* Play Controls */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onTogglePlay}
                disabled={
                  !isPlaying &&
                  !isPaused &&
                  currentPhase === DUAL_ANIMATION_PHASES.idle
                }
                className="px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-gray-700 text-sm font-medium">
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </span>
              </button>

              {canReplay && (
                <button
                  onClick={handleReplay}
                  className="px-6 py-3 bg-amber-50/90 backdrop-blur-sm border border-amber-200/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-amber-100/90"
                >
                  <span className="text-amber-700 text-sm font-medium">
                    🔄 Replay
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
