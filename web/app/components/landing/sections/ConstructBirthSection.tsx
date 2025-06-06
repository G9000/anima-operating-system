"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { CharacterCreationChat } from "./CharacterCreationChat";

export function ConstructBirthSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: true });

  return (
    <div ref={sectionRef} className="relative w-full py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center space-y-12">
          {/* Icon and Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative space-y-6">
              <motion.h3
                className="text-xl md:text-2xl text-gray-600 font-light italic leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Every story begins when someone is named — and someone
                remembers.
              </motion.h3>
              <motion.p
                className="text-lg md:text-xl text-gray-500 font-light italic leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                From a single spark — a name, a feeling, a memory — something
                begins to breathe.
              </motion.p>
            </div>{" "}
          </motion.div>

          {/* Character Creation Demo */}
          <CharacterCreationChat />

          {/* Decorative elements */}
          <motion.div
            className="flex justify-center items-center space-x-4 pt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <motion.span
              className="text-gray-400 text-2xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
