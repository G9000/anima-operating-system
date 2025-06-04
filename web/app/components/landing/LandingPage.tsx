"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./sections/HeroSection";
import { MemoryWalksSection } from "./sections/MemoryWalksSection";
import { StorybookDemo } from "./sections/StorybookDemo";
import { FooterSection } from "./sections/FooterSection";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    setAnimationKey((prev) => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-light">Loading Anima OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
      {/* Hero Section */}
      <HeroSection onGetStarted={onGetStarted} onSignIn={onSignIn} />

      {/* Memory Walks Section */}
      <MemoryWalksSection />

      {/* Storybook Demo Section */}
      <StorybookDemo
        isPlaying={isPlaying}
        animationKey={animationKey}
        onTogglePlay={handleTogglePlay}
      />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
