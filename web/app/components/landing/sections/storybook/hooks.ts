"use client";

import { useState, useEffect } from "react";
import { AnimationPhase, ANIMATION_PHASES, PHASE_DURATIONS } from "./types";

export const useAnimationPhases = (isPlaying: boolean, animationKey: number) => {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>(
    ANIMATION_PHASES.idle
  );
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    setCurrentPhase(ANIMATION_PHASES.idle);
    setAnimationStarted(false);
  }, [animationKey]);

  useEffect(() => {
    if (isPlaying && !animationStarted) {
      setAnimationStarted(true);
      setCurrentPhase(ANIMATION_PHASES.dailyConversation);
    } else if (!isPlaying && animationStarted) {
      setAnimationStarted(false);
      setCurrentPhase(ANIMATION_PHASES.idle);
    }
  }, [isPlaying, animationStarted]);

  // Phase transitions
  useEffect(() => {
    if (!animationStarted) return;

    const timers: NodeJS.Timeout[] = [];

    if (currentPhase === ANIMATION_PHASES.dailyConversation) {
      timers.push(
        setTimeout(() => {
          setCurrentPhase(ANIMATION_PHASES.transformation);
        }, PHASE_DURATIONS.dailyConversation)
      );
    } else if (currentPhase === ANIMATION_PHASES.transformation) {
      timers.push(
        setTimeout(() => {
          setCurrentPhase(ANIMATION_PHASES.memoryWalk);
        }, PHASE_DURATIONS.transformation)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [currentPhase, animationStarted]);

  return currentPhase;
};
