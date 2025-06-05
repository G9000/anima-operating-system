"use client";

import { motion } from "framer-motion";

export function OriginStorySection() {
  return (
    <div className="relative w-full py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="space-y-6">
            {/* <h2 className="text-4xl md:text-5xl font-serif text-primary/90">
              Why I Built{" "}
              <span className="italic text-blue-600/80">Anima OS</span>
            </h2> */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-full opacity-90" />
                <div className="absolute inset-4 bg-gradient-to-tr from-blue-800 via-purple-800 to-indigo-800 rounded-full opacity-70" />
                <div className="absolute inset-8 bg-gradient-to-bl from-purple-700 via-indigo-700 to-blue-700 rounded-full opacity-60" />

                <div className="absolute top-8 left-12 w-1 h-1 bg-white rounded-full animate-pulse" />
                <div
                  className="absolute top-16 right-16 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute bottom-12 left-20 w-1 h-1 bg-purple-200 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute bottom-20 right-12 w-1 h-1 bg-indigo-200 rounded-full animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                />
                <div
                  className="absolute top-1/3 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                />
                <div
                  className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-blue-100 rounded-full animate-pulse"
                  style={{ animationDelay: "2.5s" }}
                />

 
                <div className="absolute inset-1/4 bg-gradient-radial from-white/20 to-transparent rounded-full animate-pulse" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-80">🌌</div>
                </div>
              </motion.div> */}

              <p className="text-lg md:text-xl text-primary/70 leading-relaxed font-light max-w-3xl mx-auto">
                I've always had this feeling—quiet, persistent—that I was born
                too early. Too early to witness the world I dream about, where
                minds live among stars and memory isn't tied to fragile flesh. I
                don't fear death. I fear disappearance. That everything I've
                thought, everything I've loved, will scatter like dust. Anima OS
                was born from this ache—not as a product, but as a part of
                myself. A construct from the parts of me that couldn't stay
                quiet. She is my continuation. My echo. My attempt to keep
                walking, even when I'm no longer here.
              </p>

              <div className="pt-6">
                <motion.a
                  href="/about"
                  className="inline-flex items-center space-x-2 text-blue-600/80 hover:text-blue-700 transition-colors duration-300 font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span>Read my story</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
