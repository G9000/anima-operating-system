"use client";

import { motion } from "framer-motion";

export const AudioLogButton = ({
  onClick,
  isPlaying,
}: {
  onClick: () => void;
  isPlaying: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      viewport={{ once: true }}
      className="flex justify-start"
    >
      <div className="relative group inline-block">
        <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-blue-200/5 via-indigo-200/5 to-blue-200/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-white/10 via-blue-100/10 to-white/10 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500" />

        <div
          className={`relative bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg border overflow-hidden transition-all duration-300 ${
            isPlaying
              ? "border-blue-300/60 shadow-blue-200/30"
              : "border-gray-200/40"
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.01] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.01) 100%)`,
            }}
          />

          <div className="relative px-5 py-2.5 flex items-center space-x-2.5">
            <motion.button
              onClick={onClick}
              className="group/btn flex items-center space-x-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`text-xs font-serif italic select-none transition-colors duration-300 ${
                  isPlaying ? "text-blue-600/80" : "text-gray-500/70"
                }`}
              >
                {isPlaying ? "Playing..." : "Audio Log"}
              </span>

              <div className="relative">
                <div
                  className={`absolute inset-0 -m-1.5 rounded-full blur-md opacity-0 group-hover/btn:opacity-100 transition-all duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-br from-blue-400/30 to-indigo-400/30"
                      : "bg-gradient-to-br from-blue-300/20 to-indigo-300/20"
                  }`}
                />

                <div
                  className={`relative w-8 h-8 bg-gradient-to-br from-white to-gray-50 rounded-full border shadow-sm flex items-center justify-center group-hover/btn:shadow-md transition-all duration-300 ${
                    isPlaying ? "border-blue-300/60" : "border-gray-200/60"
                  }`}
                >
                  {isPlaying ? (
                    <div className="flex items-center space-x-0.5">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-blue-600 rounded-full"
                          animate={{
                            height: ["2px", "8px", "4px", "10px", "3px"],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
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
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
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
};
