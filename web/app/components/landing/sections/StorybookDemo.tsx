"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ReplayControls } from "./ReplayControls";
import { FeaturesSection } from "./FeaturesSection";
import { StorybookDemoProps } from "../types";
import { BookHeader } from "./storybook/BookComponents";
import { DailyConversation } from "./storybook/DailyConversation";
import {
  TransformationAnimation,
  IdleState,
} from "./storybook/AnimationStates";
import { AudioLogButton } from "./storybook/AudioLogButton";
import { useAnimationPhases } from "./storybook/hooks";
import { useStreamingText } from "./storybook/StreamingText";
import { ANIMATION_PHASES } from "./storybook/types";
import { MEMORY_WALK_TEXTS } from "./storybook/data";

export function StorybookDemo({
  isPlaying,
  animationKey,
  onTogglePlay,
}: StorybookDemoProps & { onTogglePlay: () => void }) {
  const [showAudioLog, setShowAudioLog] = useState(false);
  const [internalAnimationKey, setInternalAnimationKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPhase = useAnimationPhases(
    isPlaying,
    animationKey + internalAnimationKey
  );

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/samples/the-tale-of-oyen.mp3");
    audioRef.current.addEventListener("ended", () => {
      setShowAudioLog(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => {
          setShowAudioLog(false);
        });
      }
    };
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (showAudioLog) {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [showAudioLog]);

  // Handle replay functionality internally
  const handleReplay = () => {
    setShowAudioLog(false);
    setInternalAnimationKey((prev) => prev + 1);
    // If not already playing, start playing
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const { renderStreamingText, isComplete: isStreamingComplete } =
    useStreamingText(
      currentPhase === ANIMATION_PHASES.memoryWalk,
      MEMORY_WALK_TEXTS
    );

  // Only consider animation complete when we're in memoryWalk phase AND streaming is done
  const isComplete =
    currentPhase === ANIMATION_PHASES.memoryWalk && isStreamingComplete;

  // Reset audio log when animation restarts
  useEffect(() => {
    if (!isPlaying) {
      setShowAudioLog(false);
    }
  }, [isPlaying, animationKey]);

  return (
    <div className="relative w-full py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50, rotateY: -30 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              whileHover={{ rotateY: 5 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              style={{ perspective: 1000 }}
            >
              <div className="relative">
                <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-r from-gray-200/20 via-gray-100/20 to-gray-200/20 blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-1000 scale-95 group-hover:scale-100" />
                <div className="absolute inset-0 -m-6 rounded-2xl bg-gradient-to-br from-gray-100/30 via-white/30 to-gray-100/30 blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                <div className="absolute inset-0 -m-4 rounded-xl bg-white/40 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />

                <div
                  className="absolute top-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-hover:shadow-lg group-hover:shadow-gray-300/50"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #d1d5db 5%, #d1d5db 95%, rgba(255, 255, 255, 0) 100%)",
                    filter: "drop-shadow(0 0 2px rgba(209, 213, 219, 0.5))",
                  }}
                />
                <div
                  className="absolute bottom-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-hover:shadow-lg group-hover:shadow-gray-300/50"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #d1d5db 5%, #d1d5db 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
                <div
                  className="absolute -top-3 left-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-hover:shadow-lg group-hover:shadow-gray-300/50"
                  style={{
                    background:
                      "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #d1d5db 5%, #d1d5db 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
                <div
                  className="absolute -top-3 right-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-hover:shadow-lg group-hover:shadow-gray-300/50"
                  style={{
                    background:
                      "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #d1d5db 5%, #d1d5db 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />

                <motion.div
                  className="relative bg-gradient-to-br from-[#fdfcfb] via-[#fcfaf8] to-[#faf8f5] backdrop-blur-sm shadow-xl border border-gray-200/50 overflow-hidden rounded-lg"
                  whileHover={{
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    // Paper texture effect
                    backgroundImage: `
                      linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%),
                      linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%),
                      radial-gradient(ellipse at top left, rgba(255,250,240,0.8) 0%, transparent 50%),
                      radial-gradient(ellipse at bottom right, rgba(255,248,235,0.8) 0%, transparent 50%)
                    `,
                    boxShadow: `
                      0 4px 6px rgba(0,0,0,0.05),
                      0 10px 15px -3px rgba(0,0,0,0.08),
                      inset 0 0 20px rgba(0,0,0,0.02)
                    `,
                  }}
                >
                  {/* Book spine shadow */}

                  {/* Page edges effect */}
                  <div className="absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-300/50 to-transparent" />
                  <div className="absolute right-1 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200/30 to-transparent" />

                  <BookHeader />

                  <div className="relative">
                    {/* Page texture overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise' seed='2'/%3E%3CfeDiffuseLighting in='noise' lighting-color='white' surfaceScale='1'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                        backgroundBlendMode: "multiply",
                      }}
                    />

                    <div className="p-8 space-y-6 h-[600px] overflow-y-auto relative bg-gradient-to-b from-transparent via-[#fdfcfb]/50 to-[#faf8f5]/80">
                      <AnimatePresence mode="wait">
                        {currentPhase === ANIMATION_PHASES.idle && (
                          <IdleState />
                        )}
                        {currentPhase ===
                          ANIMATION_PHASES.dailyConversation && (
                          <DailyConversation />
                        )}
                        {currentPhase === ANIMATION_PHASES.transformation && (
                          <TransformationAnimation />
                        )}
                        {currentPhase === ANIMATION_PHASES.memoryWalk && (
                          <motion.div
                            key="memoryWalk"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                          >
                            {renderStreamingText()}
                            {isStreamingComplete && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="mt-8 text-center"
                              >
                                <motion.span
                                  className="text-gray-400/40 text-2xl font-light"
                                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                >
                                  ✦ ✦ ✦
                                </motion.span>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-end items-center mt-4 space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isComplete && (
                    <AudioLogButton
                      onClick={() => setShowAudioLog(!showAudioLog)}
                      isPlaying={showAudioLog}
                    />
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isComplete && <ReplayControls onReplay={handleReplay} />}
                </motion.div>
              </div>
            </motion.div>
          </div>

          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
