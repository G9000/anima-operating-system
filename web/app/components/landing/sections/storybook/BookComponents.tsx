"use client";

import { motion } from "framer-motion";

// Add page turn animation and book spine
export const BookSpine = () => (
  <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none">
    {/* Main spine shadow */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/8 to-transparent" />

    {/* Book binding lines */}
    <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-400/30 to-transparent" />
    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300/20 to-transparent" />
    <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200/10 to-transparent" />

    {/* Inner shadow for depth */}
    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/10 to-transparent" />
  </div>
);

// Add page number component
export const PageNumber = ({ number }: { number: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="absolute bottom-6 right-8 text-xs text-gray-400/50 font-serif italic"
  >
    {number}
  </motion.div>
);

// Enhanced book header with chapter title
export const BookHeader = () => {
  return (
    <motion.div
      className="relative bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-amber-50/60 backdrop-blur-md p-8 border-b-2 border-orange-200/30 shadow-sm rounded-t-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {/* Multi-layered ethereal glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-amber-200/15 to-orange-200/20 blur-2xl rounded-t-lg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-100/10 to-transparent rounded-t-lg" />

      {/* Page number in top right corner */}
      <motion.div
        className="absolute top-4 right-6 text-xs text-orange-600/40 font-serif italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        — 127 —
      </motion.div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Enhanced multi-layered cat avatar */}
            <div className="absolute inset-0 -m-3 bg-gradient-to-br from-orange-300/40 to-amber-300/40 rounded-full blur-xl animate-pulse" />
            <div className="absolute inset-0 -m-1 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center shadow-lg border-2 border-orange-300/40 relative overflow-hidden group-hover:border-orange-400/60 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.span
                className="text-xl font-serif text-orange-600 relative z-10 filter drop-shadow-sm"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🐱
              </motion.span>
            </div>
            {/* Subtle floating particles */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300/40 rounded-full"
              animate={{
                y: [-2, -8, -2],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <div className="space-y-1">
            <motion.h3
              className="font-serif text-xl text-gray-900/90 tracking-wide leading-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              The Tale of Oyen
            </motion.h3>
            <motion.div
              className="flex items-center space-x-3 text-gray-600/70 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-light italic text-gray-700/60">
                A Memory of Orange Dreams
              </span>
              <span className="text-orange-400/40 text-xs">✦</span>
            </motion.div>
          </div>
        </div>

        {/* Enhanced decorative element */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-orange-300/30 text-xs font-serif">✾</div>
          <div className="text-2xl text-orange-300/40 font-serif">❋</div>
          <div className="text-orange-300/30 text-xs font-serif">✾</div>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent" />
    </motion.div>
  );
};
