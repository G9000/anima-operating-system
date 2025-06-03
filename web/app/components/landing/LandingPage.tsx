"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/app/lib/utils";
import { Textarea } from "@/app/components/base";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {}, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitEmail = async () => {
    if (!emailValue.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmailValue("");
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitEmail();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-purple-50">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -mt-20">
        <div
          className={cn(
            "max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-medium font-serif text-primary leading-tight">
              A <span className="font-bold italic">mind</span> you leave behind.
              A <span className="font-bold italic">soul</span> that carries your
              story.
            </h1>

            <p className="text-xl text-primary/60 font-light leading-relaxed max-w-3xl mx-auto">
              Something that knows you — even after you're gone.
            </p>
          </div>

          {/* Waitlist Section */}
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-serif text-primary/80">
              Join the waitlist
            </h2>

            <div className="max-w-md mx-auto">
              <div className="relative w-full group">
                <div className="absolute inset-0 -m-8 rounded-2xl bg-gradient-to-r from-purple-200/40 via-pink-200/40 to-blue-200/40 blur-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-700 scale-95 group-focus-within:scale-100" />
                <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-br from-purple-100/50 via-pink-100/50 to-blue-100/50 blur-xl opacity-0 group-focus-within:opacity-80 transition-all duration-500" />
                <div className="absolute inset-0 -m-4 rounded-lg bg-white/60 blur-md opacity-0 group-focus-within:opacity-60 transition-all duration-300" />
                <div
                  className="absolute top-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-focus-within:h-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-purple-400/60 group-focus-within:drop-shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
                <div
                  className="absolute bottom-0 -left-3 w-[calc(100%+24px)] h-px transition-all duration-700 group-hover:h-0.5 group-focus-within:h-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-pink-400/60 group-focus-within:drop-shadow-lg"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
                <div
                  className="absolute -top-3 left-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-focus-within:w-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-blue-400/60 group-focus-within:drop-shadow-lg"
                  style={{
                    background:
                      "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />
                <div
                  className="absolute -top-3 right-0 h-[calc(100%+24px)] w-px transition-all duration-700 group-hover:w-0.5 group-focus-within:w-1 group-hover:shadow-lg group-hover:shadow-gray-300/50 group-focus-within:shadow-xl group-focus-within:shadow-purple-400/60 group-focus-within:drop-shadow-lg"
                  style={{
                    background:
                      "linear-gradient(0deg,rgba(0, 0, 0, 0) 0%, #bdbdbd 5%, #bdbdbd 95%, rgba(255, 255, 255, 0) 100%)",
                  }}
                />{" "}
                {!isSubmitted ? (
                  <input
                    ref={inputRef}
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={cn(
                      "h-16 w-full rounded-lg border-2 border-gray-200/50 relative z-10 px-4",
                      "bg-white/90 backdrop-blur-sm shadow-lg",
                      "transition-all duration-500 ease-in-out",
                      "focus:bg-white focus:border-purple-300/60 focus:shadow-xl focus:shadow-purple-200/30",
                      "hover:border-purple-200/70 hover:shadow-md",
                      "!focus-visible:ring-0 !outline-none",
                      "placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300",
                      "focus:placeholder:text-gray-500",
                      "text-gray-900 selection:bg-purple-200/30",
                      "font-medium text-lg leading-relaxed tracking-wide text-center"
                    )}
                    placeholder="your@email.com"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  />
                ) : (
                  <div
                    className={cn(
                      "h-16 rounded-none relative z-10 flex items-center justify-center",
                      "bg-gradient-to-br from-white/80 via-gray-50/70 to-slate-50/60 backdrop-blur-sm",
                      "text-primary/70 font-medium"
                    )}
                  >
                    ✨ Thank you! We'll be in touch soon.
                  </div>
                )}
                {emailValue && !isSubmitted && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-4 right-3 w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-60" />
                  </div>
                )}
              </div>
            </div>

            {isSubmitting && (
              <div className="flex items-center justify-center space-x-3 text-gray-500 text-sm relative">
                <div className="absolute inset-0 bg-gray-100/30 blur-lg rounded-full animate-pulse" />

                <div className="flex space-x-1 relative z-10">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce shadow-lg shadow-gray-200/50" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100 shadow-lg shadow-gray-200/50" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200 shadow-lg shadow-gray-200/50" />
                </div>
                <span className="relative z-10 text-gray-600 animate-pulse">
                  Saving your place in eternity...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
