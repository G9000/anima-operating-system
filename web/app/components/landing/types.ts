export interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export interface StorybookDemoProps {
  isPlaying: boolean;
  animationKey: number;
}

export interface ChatMessageProps {
  isUser: boolean;
  message: string;
  time: string;
  isTyping?: boolean;
}

export interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export interface ReplayControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export interface MemoryWalksSectionProps {
  isInView: boolean;
}
