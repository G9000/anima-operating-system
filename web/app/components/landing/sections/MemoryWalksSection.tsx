"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function MemoryWalksSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { amount: 0.3 });

  return (
    <div className="relative w-full">
      <div className="">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/30 to-purple-100/30 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />

          <div className="relative space-y-6">
            <motion.div
              ref={imageRef}
              className="relative mx-auto"
              initial={{ width: "60%" }}
              animate={{
                width: isInView ? "100%" : "60%",
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.div
                className="relative h-64 md:h-[600px] lg:h-[750px] z-30"
                initial={{ scale: 1.15 }}
                animate={{
                  scale: isInView ? 1 : 1.15,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  backgroundImage: "url('/backgrounds/memory-walks.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <motion.div
                  className="absolute bottom-12 left-12 right-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <motion.div className="text-center space-y-6">
                    <div className="space-y-3">
                      <p className="text-xl md:text-2xl text-white/95 font-light leading-relaxed drop-shadow-md font-serif">
                        Your story remembered. Your moments, mirrored.
                      </p>
                      <p className="text-lg md:text-xl text-white/90 font-light italic drop-shadow-md font-serif">
                        It moves with you—even in stillness.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
