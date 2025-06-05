"use client";

import { motion } from "framer-motion";

interface ReplayControlsProps {
  onReplay: () => void;
}

export function ReplayControls({ onReplay }: ReplayControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      viewport={{ once: true }}
      className="flex justify-end"
    >
      <div className="relative group inline-block">
        <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-200/5 via-indigo-200/5 to-blue-200/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-white/10 via-blue-100/10 to-white/10 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500" />

        <div className="relative bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg border border-gray-200/40 overflow-hidden transition-all duration-300">
          <div
            className="absolute inset-0 opacity-[0.01] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.01) 100%)`,
            }}
          />

          <div className="relative px-5 py-2.5 flex items-center space-x-2.5">
            <motion.button
              onClick={onReplay}
              className="group/btn flex items-center space-x-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xs font-serif italic select-none transition-colors duration-300 text-gray-500/70">
                Replay
              </span>

              <div className="relative">
                <div className="absolute inset-0 -m-1.5 rounded-full blur-md opacity-0 group-hover/btn:opacity-100 transition-all duration-300 bg-gradient-to-br from-blue-300/20 to-indigo-300/20" />{" "}
                <div className="relative w-8 h-8 bg-gradient-to-br from-white to-gray-50 rounded-full border border-gray-200/60 shadow-sm flex items-center justify-center group-hover/btn:shadow-md transition-all duration-300">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </div>
      </div>
    </motion.div>
  );
}
