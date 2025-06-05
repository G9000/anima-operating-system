"use client";

import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "./types";

export const TransformationAnimation = () => (
  <motion.div
    key="transformation"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
  >
    <div className="relative">
      {/* Cosmic particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0
                ? "rgba(251, 146, 60, 0.8)"
                : "rgba(99, 102, 241, 0.8)"
            } 0%, transparent 70%)`,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            x: Math.cos((i * 30 * Math.PI) / 180) * 100,
            y: Math.sin((i * 30 * Math.PI) / 180) * 100,
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Central transformation core */}
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.2, 1],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 -m-8 bg-gradient-to-br from-orange-300/30 via-blue-300/30 to-indigo-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-white/90 to-gray-50/90 flex items-center justify-center backdrop-blur-sm border border-gray-200/30 shadow-2xl">
          <motion.span
            className="text-3xl"
            animate={{
              rotate: [0, -360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2.5 }}
          >
            ✨
          </motion.span>
        </div>
      </motion.div>

      <motion.p
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-gray-500/60 font-serif italic text-sm whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        Crystallizing into memory...
      </motion.p>
    </div>
  </motion.div>
);

export const IdleState = () => (
  <motion.div
    key="defaultState"
    variants={ANIMATION_VARIANTS.page}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }}
    className="text-center space-y-6 relative h-full flex flex-col items-center justify-center"
  >
    {/* Decorative border */}
    <div className="absolute inset-4 border border-dashed border-orange-200/20 rounded-lg pointer-events-none" />

    {/* Floating memory fragments with serif font */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-orange-300/20 text-sm font-serif italic"
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
          }}
          animate={{
            y: [null, -200],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 8,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${60 + Math.random() * 20}%`,
          }}
        >
          {["orange", "basket", "oyen", "smile", "memory"][i]}
        </motion.div>
      ))}
    </div>

    {/* Ornate symbol */}
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute inset-0 -m-8 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-2xl animate-pulse" />
      <div className="text-6xl text-orange-400/40 font-serif">✾</div>
    </motion.div>

    <motion.div
      className="space-y-2"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <p className="text-gray-600/70 font-serif italic text-lg">
        "Every memory begins with a moment..."
      </p>
      <p className="text-gray-500/50 font-serif text-sm">
        Press play to turn the page
      </p>
    </motion.div>

    {/* Book-style divider */}
    <div className="flex items-center space-x-2 text-orange-300/30">
      <span>❦</span>
      <span className="text-xs">❦</span>
      <span>❦</span>
    </div>

    <div className="text-gray-400/40 text-sm space-y-1">
      <span className="font-serif">Chapter VII</span>
      <motion.div
        className="text-xs"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="font-serif italic">The Tale of Oyen</span>
      </motion.div>
    </div>
  </motion.div>
);
