"use client";

import { motion } from "framer-motion";
import { TextItem } from "./types";

export const useStaticText = (isActive: boolean, texts: TextItem[]) => {
  const renderStaticText = () => {
    if (!isActive) return null;

    return texts.map((text, textIndex) => {
      if (text.isImage) {
        return (
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: textIndex * 0.1 }}
            className={text.className}
          >
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-lg blur-md" />
              <div className="relative p-2 bg-white/80 rounded-lg shadow-lg border-2 border-double border-orange-200/30">
                <img
                  src={text.imageUrl}
                  alt={text.imageAlt || "illustration"}
                  className="rounded shadow-inner max-h-56 object-contain"
                />
                <p className="mt-2 text-center text-xs text-gray-500/60 font-serif italic">
                  {text.imageAlt}
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
          transition={{ duration: 0.3, delay: textIndex * 0.1 }}
          className="mb-6"
        >
          <p className={text.className}>{text.content}</p>
        </motion.div>
      );
    });
  };

  return {
    renderStaticText,
    isComplete: isActive,
  };
};
