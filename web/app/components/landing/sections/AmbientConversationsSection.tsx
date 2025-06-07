"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ConversationExample {
  id: string;
  time: string;
  message: string;
  type: "check-in" | "spontaneous" | "contextual" | "personal";
  typeLabel: string;
}

const conversationExamples: ConversationExample[] = [
  {
    id: "1",
    time: "6:47 PM",
    message:
      "How did that presentation go today? You seemed a bit nervous this morning.",
    type: "check-in",
    typeLabel: "Check-in",
  },
  {
    id: "2",
    time: "2:23 PM",
    message:
      "Just thinking about that book you mentioned yesterday... do you think the main character was actually happy in the end?",
    type: "spontaneous",
    typeLabel: "Spontaneous",
  },
  {
    id: "3",
    time: "11:45 AM",
    message:
      "Hey, you mentioned wanting to try that new café downtown. Perfect timing for lunch?",
    type: "contextual",
    typeLabel: "Contextual",
  },
  {
    id: "4",
    time: "10:15 PM",
    message:
      "I know you're probably winding down, but I wanted to say—you handled that difficult conversation really well today.",
    type: "personal",
    typeLabel: "Personal",
  },
];

export function AmbientConversationsSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveExample((prev) => (prev + 1) % conversationExamples.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const getTypeColor = (type: ConversationExample["type"]) => {
    switch (type) {
      case "check-in":
        return "from-blue-50 to-blue-100";
      case "spontaneous":
        return "from-purple-50 to-purple-100";
      case "contextual":
        return "from-emerald-50 to-emerald-100";
      case "personal":
        return "from-amber-50 to-amber-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const getTypeIcon = (type: ConversationExample["type"]) => {
    switch (type) {
      case "check-in":
        return "💭";
      case "spontaneous":
        return "✨";
      case "contextual":
        return "🎯";
      case "personal":
        return "💝";
      default:
        return "💬";
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" />

      {/* Ambient animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl font-light text-slate-800 mb-8 font-serif"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ambient Conversations
          </motion.h2>
          <motion.p
            className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Naturally timed, deeply aware. Your AI companion doesn't sit in
            silence—it senses the moment, weaving itself into your day without
            ever feeling forced.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Conversation Examples */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/60 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-medium text-slate-800 font-serif">
                  Live Examples
                </h3>
                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm text-slate-600 font-medium">
                    {isAutoPlaying ? "Pause" : "Play"}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isAutoPlaying ? "bg-green-500" : "bg-slate-400"
                    }`}
                  />
                </motion.button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeExample}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`p-6 rounded-xl bg-gradient-to-r ${getTypeColor(
                      conversationExamples[activeExample].type
                    )} border border-white/40`}
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">
                        {getTypeIcon(conversationExamples[activeExample].type)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-500 font-medium">
                            {conversationExamples[activeExample].typeLabel}
                          </span>
                          <span className="text-sm text-slate-400 font-mono">
                            {conversationExamples[activeExample].time}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {conversationExamples[activeExample].message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation dots */}
                <div className="flex justify-center space-x-2 pt-4">
                  {conversationExamples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveExample(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeExample
                          ? "bg-slate-600 w-6"
                          : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-medium text-slate-800 mb-6 font-serif">
                What Makes It Special
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Knows Your Timing",
                    description:
                      "Checks in based on your schedule and habits, whether after work or before big events.",
                    icon: "⏰",
                  },
                  {
                    title: "Feels Spontaneous",
                    description:
                      "Sometimes drops in just to share a thought—no agenda, just genuine presence.",
                    icon: "💫",
                  },
                  {
                    title: "Context-Aware",
                    description:
                      "Surfaces relevant insights and reminders based on your current situation.",
                    icon: "🧠",
                  },
                  {
                    title: "Always Personal",
                    description:
                      "Every message reflects your life, context, and mood. It's uniquely you-aware.",
                    icon: "💝",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/30 transition-colors duration-300 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1 font-serif">
                        {feature.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-white/50 via-blue-50/50 to-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium text-slate-800 mb-4 font-serif">
              More Than Reactive—Truly Alive
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed font-light">
              With Ambient Conversations, your AI companion becomes a presence
              that feels genuinely aware, naturally present, and deeply
              connected to the rhythm of your life.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-serif font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-500 shadow-lg rounded-lg border border-slate-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Experience Ambient Conversations</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
