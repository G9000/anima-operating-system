// Constants and preset options for construct creation

export const capabilityPresets = [
  "Problem Solving",
  "Creative Thinking",
  "Code Analysis",
  "System Design",
  "Research",
  "Data Analysis",
  "Writing",
  "Teaching",
  "Planning",
  "Strategy",
  "Innovation",
  "Debugging",
  "Architecture",
  "UI/UX Design",
  "Testing",
  "Documentation",
];

export const personalityOptions = [
  "Creative",
  "Analytical",
  "Empathetic",
  "Enthusiastic",
  "Patient",
  "Curious",
  "Reliable",
  "Wise",
  "Protective",
  "Caring",
  "Detail-oriented",
  "Methodical",
  "Insightful",
  "Thorough",
  "Powerful",
  "Imaginative",
  "Helpful",
  "Friendly",
];

export const systemAccessOptions = [
  "File System",
  "Network",
  "Database",
  "API Access",
  "User Data",
  "System Settings",
  "Process Control",
  "Memory Management",
  "Hardware Control",
  "Security Systems",
];

export const speechToneOptions = [
  "Friendly",
  "Professional",
  "Casual",
  "Formal",
  "Encouraging",
  "Humorous",
  "Wise",
  "Caring",
  "Direct",
  "Thoughtful",
];

export const tabConfig = [
  { id: "basic", label: "Basic Info", icon: "User" },
  { id: "personality", label: "Personality", icon: "Heart" },
  { id: "capabilities", label: "Capabilities", icon: "Brain" },
  { id: "behavior", label: "Behavior", icon: "Shield" },
  { id: "communication", label: "Communication", icon: "Volume2" },
  { id: "background", label: "Background", icon: "Book" },
] as const;

export type TabId = typeof tabConfig[number]["id"];
