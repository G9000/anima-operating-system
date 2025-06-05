"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { TextItem, WordItem, PHASE_DURATIONS } from "./types";

export const useStreamingText = (isActive: boolean, texts: TextItem[]) => {
  const [streamingWordIndex, setStreamingWordIndex] = useState(0);

  const allWords = useMemo(
    () =>
      texts.flatMap((text, textIndex) =>
        text.isImage
          ? [
              {
                word: text.content,
                textIndex,
                wordIndex: 0,
                className: text.className,
                isLastWordInText: true,
                isImage: true,
                imageUrl: text.imageUrl,
                imageAlt: text.imageAlt,
              },
            ]
          : text.content.split(" ").map((word, wordIndex) => ({
              word,
              textIndex,
              wordIndex,
              className: text.className,
              isLastWordInText:
                wordIndex === text.content.split(" ").length - 1,
              isImage: false,
              imageUrl: undefined,
              imageAlt: undefined,
            }))
      ),
    [texts]
  );

  useEffect(() => {
    if (!isActive) {
      setStreamingWordIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStreamingWordIndex((prev) =>
        prev < allWords.length - 1 ? prev + 1 : prev
      );
    }, PHASE_DURATIONS.streamingSpeed);

    return () => clearInterval(interval);
  }, [isActive, allWords.length]);

  const renderStreamingText = useCallback(() => {
    const groupedByText = allWords
      .slice(0, streamingWordIndex + 1)
      .reduce((acc, item) => {
        if (!acc[item.textIndex]) {
          acc[item.textIndex] = [];
        }
        acc[item.textIndex].push(item);
        return acc;
      }, {} as Record<number, WordItem[]>);

    return Object.entries(groupedByText).map(([textIndex, words]) => {
      const first = words[0];

      if (first.isImage) {
        return (
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={first.className}
          >
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-lg blur-md" />
              <div className="relative p-2 bg-white/80 rounded-lg shadow-lg border-2 border-double border-orange-200/30">
                <img
                  src={first.imageUrl}
                  alt={first.imageAlt || "illustration"}
                  className="rounded shadow-inner max-h-56 object-contain"
                />
                <p className="mt-2 text-center text-xs text-gray-500/60 font-serif italic">
                  {first.imageAlt}
                </p>
              </div>
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <p className={first.className}>
            {words.map((item, wordIndex) => (
              <motion.span
                key={`${textIndex}-${wordIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="inline"
              >
                {item.word}
                {wordIndex < words.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </p>
        </motion.div>
      );
    });
  }, [allWords, streamingWordIndex]);

  return {
    renderStreamingText,
    isComplete: streamingWordIndex >= allWords.length - 1,
  };
};
