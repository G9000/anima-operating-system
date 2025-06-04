"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ReplayControls } from "./ReplayControls";
import { FeaturesSection } from "./FeaturesSection";
import { StorybookDemoProps } from "../types";

export function StorybookDemo({
  isPlaying,
  animationKey,
  onTogglePlay,
}: StorybookDemoProps & { onTogglePlay: () => void }) {
  const [showDailyConversation, setShowDailyConversation] = useState(false);
  const [streamingWordIndex, setStreamingWordIndex] = useState(0);
  const [showMemoryWalk, setShowMemoryWalk] = useState(false);
  const [showTransformation, setShowTransformation] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Reset all states when animation key changes (replay)
  useEffect(() => {
    setShowDailyConversation(false);
    setStreamingWordIndex(0);
    setShowMemoryWalk(false);
    setShowTransformation(false);
    setAnimationStarted(false);
  }, [animationKey]);

  // Track when animation starts and begin the sequence
  useEffect(() => {
    if (isPlaying && !animationStarted) {
      setAnimationStarted(true);
      setShowDailyConversation(true);
    } else if (!isPlaying && animationStarted) {
      // Reset when stopped
      setAnimationStarted(false);
      setShowDailyConversation(false);
      setShowTransformation(false);
      setShowMemoryWalk(false);
      setStreamingWordIndex(0);
    }
  }, [isPlaying, animationStarted]);

  // Control phase transitions with timers
  useEffect(() => {
    if (animationStarted && showDailyConversation) {
      const dailyTimer = setTimeout(() => {
        setShowDailyConversation(false);
        setShowTransformation(true);

        const transformTimer = setTimeout(() => {
          setShowTransformation(false);
          setShowMemoryWalk(true);
        }, 2500); // Transformation phase duration

        return () => clearTimeout(transformTimer);
      }, 3000); // Daily conversation phase duration

      return () => clearTimeout(dailyTimer);
    }
  }, [animationStarted, showDailyConversation]);

  // Memory Walk text content
  const memoryWalkTexts = [
    {
      content:
        "The autumn afternoon held promise as Maya shared news of her transformation. Her words painted a familiar picture—that sensation of standing at life's precipice, where excitement and terror dance together in perfect balance.",
      className:
        "font-serif text-gray-800/85 leading-loose text-lg first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-blue-600 first-letter:leading-none",
    },
    {
      content:
        '"Like standing at the edge of a cliff," she had said, her voice carrying both the weight of decision and the lightness of possibility. It was a metaphor that would echo through time, capturing the essence of every brave leap she would take.',
      className:
        "font-serif text-gray-700/75 leading-loose text-base italic pl-6 border-l-2 border-gray-200/20",
    },
    {
      content:
        "Years later, this moment would be remembered not for its ordinary Tuesday afternoon setting, but for the courage it represented. The job was merely a catalyst—what truly mattered was Maya's recognition that growth requires embracing both excitement and fear.",
      className: "font-serif text-gray-800/85 leading-loose text-base",
    },
    {
      content:
        "Her companion had witnessed many such crossroads, each one a thread in the tapestry of Maya's becoming. This particular thread shimmered with the golden hue of transformation, marking the day she chose possibility over comfort.",
      className: "font-serif text-gray-700/75 leading-loose text-base",
    },
  ];

  // Split all text into words for streaming effect
  const allWords = memoryWalkTexts.flatMap((text, textIndex) =>
    text.content.split(" ").map((word, wordIndex) => ({
      word,
      textIndex,
      wordIndex,
      className: text.className,
      isLastWordInText: wordIndex === text.content.split(" ").length - 1,
    }))
  );

  // Start Memory Walk streaming when Daily Conversation completes
  useEffect(() => {
    if (showMemoryWalk && animationStarted) {
      // Reset streaming index when starting
      setStreamingWordIndex(0);

      const streamingInterval = setInterval(() => {
        setStreamingWordIndex((prev) => {
          if (prev < allWords.length - 1) {
            return prev + 1;
          } else {
            clearInterval(streamingInterval);
            return prev;
          }
        });
      }, 100); // Adjust speed as needed (100ms per word)

      return () => clearInterval(streamingInterval);
    }
  }, [showMemoryWalk, animationStarted, allWords.length]);

  // Function to render streaming text
  const renderStreamingText = () => {
    const groupedByText = allWords
      .slice(0, streamingWordIndex + 1)
      .reduce((acc, item) => {
        if (!acc[item.textIndex]) {
          acc[item.textIndex] = [];
        }
        acc[item.textIndex].push(item);
        return acc;
      }, {} as Record<number, typeof allWords>);

    return Object.entries(groupedByText).map(([textIndex, words]) => (
      <motion.div
        key={textIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <p className={words[0].className}>
          {words.map((item, index) => (
            <motion.span
              key={`${textIndex}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="inline"
            >
              {item.word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </p>
      </motion.div>
    ));
  };

  return (
    <div className="relative w-full py-32 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            {/* Storybook Interface */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Paper-like depth layers */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-r from-gray-200/20 via-gray-100/20 to-gray-200/20 blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-1000 scale-95 group-hover:scale-100" />
                <div className="absolute inset-0 -m-6 rounded-2xl bg-gradient-to-br from-gray-100/30 via-white/30 to-gray-100/30 blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
                <div className="absolute inset-0 -m-4 rounded-xl bg-white/40 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500" />

                {/* Paper edge borders */}
                <div
                  className="absolute top-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-hover:shadow-lg group-hover:shadow-gray-300/50"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #d1d5db 5%, #d1d5db 95%, rgba(255, 255, 255, 0) 100%)",
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

                {/* Main book container */}
                <div className="relative bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300/50 via-gray-400/50 to-gray-300/50 shadow-inner" />

                  {/* Paper texture overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.01) 2px,
                        rgba(0,0,0,0.01) 4px
                      )`,
                    }}
                  />

                  {/* Book Header */}
                  <div className="relative bg-gradient-to-r from-gray-100/40 to-gray-50/40 backdrop-blur-sm p-6 border-b border-gray-200/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner border border-gray-200/50">
                            <span className="text-lg font-serif text-gray-600">
                              ✦
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-gray-900/90">
                            The Chronicles of Maya
                          </h3>
                          <p className="text-gray-600/60 text-sm font-light italic">
                            Chapter VII: The Crossroads
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500/40 text-xs font-serif">
                        Page 247
                      </div>
                    </div>
                  </div>

                  {/* Story Content with paper feel */}
                  <div className="relative">
                    {/* Page shadow for depth */}
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />

                    <div className="p-8 space-y-6 h-[400px] overflow-y-auto relative">
                      {/* Subtle page lines */}
                      <div
                        className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{
                          backgroundImage: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 28px,
                            rgba(0,0,0,0.03) 28px,
                            rgba(0,0,0,0.03) 29px
                          )`,
                        }}
                      />
                      <AnimatePresence mode="wait">
                        {/* Default state - show when no animation is active */}
                        {!showDailyConversation &&
                          !showTransformation &&
                          !showMemoryWalk && (
                            <motion.div
                              key="defaultState"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="text-center space-y-6"
                            >
                              <div className="text-gray-400/60">
                                <span className="text-4xl font-serif">✦</span>
                              </div>
                              <p className="text-gray-500/60 font-serif italic text-lg">
                                Press play to witness Maya's story unfold...
                              </p>
                              <div className="text-gray-300/40 text-sm">
                                <span>— Chapter VII: The Crossroads —</span>
                              </div>
                            </motion.div>
                          )}

                        {/* Daily Conversation Phase */}
                        {showDailyConversation && (
                          <motion.div
                            key="dailyConversation"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="space-y-4 overflow-hidden" // overflow-hidden might be useful if content could exceed height during animation
                          >
                            <div className="flex justify-start">
                              <div className="max-w-[80%] bg-gray-100/50 rounded-2xl rounded-bl-md px-5 py-3 border border-gray-200/30">
                                <p className="text-gray-700 text-sm">
                                  Hey Maya, how was your day?
                                </p>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  2:14 PM
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="max-w-[80%] bg-blue-500/10 rounded-2xl rounded-br-md px-5 py-3 border border-blue-200/30">
                                <p className="text-gray-700 text-sm">
                                  It was interesting! I finally took that leap I
                                  was telling you about.
                                </p>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  2:15 PM
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="max-w-[80%] bg-gray-100/50 rounded-2xl rounded-bl-md px-5 py-3 border border-gray-200/30">
                                <p className="text-gray-700 text-sm">
                                  The new job? That's amazing! How do you feel?
                                </p>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  2:15 PM
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="max-w-[80%] bg-blue-500/10 rounded-2xl rounded-br-md px-5 py-3 border border-blue-200/30">
                                <p className="text-gray-700 text-sm">
                                  Like I'm standing at the edge of a cliff -
                                  excited and terrified at the same time.
                                </p>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  2:16 PM
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Transformation Animation */}
                        {showTransformation && (
                          <motion.div
                            key="transformation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" // Keep absolute positioning
                          >
                            <div className="text-center space-y-4">
                              <motion.div
                                // This inner animation remains as it was
                                animate={{
                                  rotate: [0, 360, 720],
                                  scale: [0.8, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2, // Duration of the star animation itself
                                  ease: "easeInOut",
                                }}
                                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 flex items-center justify-center"
                              >
                                <span className="text-2xl">✨</span>
                              </motion.div>
                              <p className="text-gray-500/60 font-serif italic text-sm">
                                Transforming into memory...
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Memory Walk Phase - Streaming Text */}
                        {showMemoryWalk && (
                          <motion.div
                            key="memoryWalk"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            // No exit prop needed if it's the last phase before a full reset via animationKey
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                          >
                            {renderStreamingText()}
                            {streamingWordIndex >= allWords.length - 1 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="mt-8 text-center"
                              >
                                <span className="text-gray-400/40 text-2xl font-light">
                                  ✦ ✦ ✦
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Page corner curl effect */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 transform rotate-45 translate-x-8 translate-y-8 shadow-inner" />
                  </div>
                </div>
              </div>

              {/* Replay Control Button */}
              <ReplayControls isPlaying={isPlaying} onToggle={onTogglePlay} />
            </motion.div>
          </div>

          {/* Right side content */}
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
