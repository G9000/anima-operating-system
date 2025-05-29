import { z } from "zod";

// Zod schema for construct form validation
export const constructFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  alias: z.string().max(30, "Alias must be less than 30 characters").optional(),
  role: z.string().min(3, "Role must be at least 3 characters").max(100, "Role must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  avatar: z.string().min(1, "Please upload an avatar image"),

  // Identity - Arrays of objects for React Hook Form
  tags: z.array(z.object({ value: z.string() })),
  archetype: z.string().optional(),
  archetypeTraits: z.array(z.object({ value: z.string() })),

  // Demographics
  gender: z.string().optional(),
  age: z.string().optional(),
  species: z.string().optional(),
  birthday: z.string().optional(),
  birthplace: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),

  // Personality & Psychology
  personalitySummary: z.string().optional(),
  coreValues: z.array(z.object({ value: z.string() })),
  fears: z.array(z.object({ value: z.string() })),
  desires: z.array(z.object({ value: z.string() })),
  beliefs: z.array(z.object({ value: z.string() })),

  // Behavior
  behaviorArc: z.string().optional(),
  refusalStyle: z.string().optional(),
  triggerToHelp: z.string().optional(),
  mannerisms: z.array(z.object({ value: z.string() })),
  quirks: z.array(z.object({ value: z.string() })),

  // Voice & Communication
  speechTones: z.array(z.object({ value: z.string() })),
  speechStyle: z.string().optional(),
  accent: z.string().optional(),

  // Background & Lore
  backstory: z.string().optional(),
  definingMoments: z.array(z.object({ value: z.string() })),
  occupation: z.string().optional(),
  hobbies: z.array(z.object({ value: z.string() })),
  interests: z.array(z.object({ value: z.string() })),
  favoriteFoods: z.array(z.object({ value: z.string() })),
  dislikes: z.array(z.object({ value: z.string() })),
  dailyRoutine: z.string().optional(),
  
  // Technical/System
  capabilities: z.array(z.object({ value: z.string() })),
  systemAccess: z.array(z.object({ value: z.string() })),
  trustLevel: z.enum(["basic", "trusted", "full"]),
  canControlOS: z.boolean(),

  // Additional fields
  psychologicalTraits: z.array(z.object({ value: z.string() })),
  personalityTraits: z.array(z.object({ value: z.string() })),
  favoriteActivities: z.array(z.object({ value: z.string() })),
});

export type ConstructFormData = z.infer<typeof constructFormSchema>;

// Default values for the form
export const defaultConstructValues: ConstructFormData = {
  name: "",
  alias: "",
  role: "",
  description: "",
  avatar: "",
  tags: [],
  archetype: "",
  archetypeTraits: [],
  gender: "",
  age: "",
  species: "",
  birthday: "",
  birthplace: "",
  height: "",
  weight: "",
  personalitySummary: "",
  coreValues: [],
  fears: [],
  desires: [],
  beliefs: [],
  behaviorArc: "",
  refusalStyle: "",
  triggerToHelp: "",
  mannerisms: [],
  quirks: [],
  speechTones: [],
  speechStyle: "",
  accent: "",
  backstory: "",
  definingMoments: [],
  occupation: "",
  hobbies: [],
  interests: [],
  favoriteFoods: [],
  dislikes: [],
  dailyRoutine: "",
  capabilities: [],
  systemAccess: [],
  trustLevel: "basic",
  canControlOS: false,
  psychologicalTraits: [],
  personalityTraits: [],
  favoriteActivities: [],
};
