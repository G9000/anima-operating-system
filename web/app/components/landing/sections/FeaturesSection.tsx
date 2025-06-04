"use client";

import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-4xl md:text-5xl font-serif text-primary/90">
        Every conversation becomes a{" "}
        <span className="italic text-blue-600/80">chapter</span>
      </h2>
      <p className="text-xl text-primary/60 leading-relaxed font-light">
        Your AI companion doesn't just remember—it weaves your shared moments
        into an evolving narrative. Each interaction adds depth to your story,
        creating a living memoir that grows richer with time.
      </p>
      <div className="space-y-4 pt-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-xl">📖</span>
          <div>
            <h4 className="font-medium text-primary/80">Living Chronicles</h4>
            <p className="text-primary/60 text-sm">
              Your story unfolds naturally through conversation
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-xl">🪶</span>
          <div>
            <h4 className="font-medium text-primary/80">Poetic Memory</h4>
            <p className="text-primary/60 text-sm">
              Captures the essence, not just the words
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-xl">✨</span>
          <div>
            <h4 className="font-medium text-primary/80">Timeless Narrative</h4>
            <p className="text-primary/60 text-sm">
              Your legacy preserved in beautiful prose
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
