"use client";

import { useState } from "react";
import { Save, X, Plus, Minus, Shield } from "lucide-react";
import { Button, Input, Label, Textarea } from "@/app/components/base";
import type { CreateConstructData } from "./types";

interface ConstructCreatorProps {
  onSave: (constructData: CreateConstructData) => void;
  onCancel: () => void;
}

const avatarOptions = [
  "🤖",
  "👨‍💻",
  "👩‍🔬",
  "🎨",
  "📚",
  "💡",
  "🔬",
  "⚡",
  "🌟",
  "🧠",
  "👾",
  "🦾",
  "🎭",
  "🔮",
  "⭐",
];

const capabilityPresets = [
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

const personalityOptions = [
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

const activityOptions = [
  "Problem Solving",
  "Creative Projects",
  "Data Analysis",
  "System Optimization",
  "User Research",
  "Code Reviews",
  "Brainstorming",
  "Learning",
  "Teaching",
  "Security Monitoring",
  "Design Work",
  "Research Projects",
  "Debugging",
];

const systemAccessOptions = [
  "File System",
  "Network",
  "Database",
  "API Management",
  "User Interface",
  "System Settings",
  "Security",
  "Analytics",
  "Media Library",
  "External APIs",
  "Process Management",
  "Memory Access",
  "Hardware Control",
  "Cloud Services",
];

export const ConstructCreator = ({
  onSave,
  onCancel,
}: ConstructCreatorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    avatar: "🤖",
    capabilities: [] as string[],
    systemAccess: [] as string[],
    trustLevel: "basic" as "basic" | "trusted" | "full",
    canControlOS: false,
    personalityTraits: [] as string[],
    favoriteActivities: [] as string[],
  });
  const [newCapability, setNewCapability] = useState("");
  const [newSystemAccess, setNewSystemAccess] = useState("");
  const [newPersonalityTrait, setNewPersonalityTrait] = useState("");
  const [newFavoriteActivity, setNewFavoriteActivity] = useState("");

  const addCapability = (capability: string) => {
    if (capability && !formData.capabilities.includes(capability)) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capability],
      });
    }
  };
  const addSystemAccess = (access: string) => {
    if (access && !formData.systemAccess.includes(access)) {
      setFormData({
        ...formData,
        systemAccess: [...formData.systemAccess, access],
      });
    }
  };

  const addPersonalityTrait = (trait: string) => {
    if (trait && !formData.personalityTraits.includes(trait)) {
      setFormData({
        ...formData,
        personalityTraits: [...formData.personalityTraits, trait],
      });
    }
  };

  const addFavoriteActivity = (activity: string) => {
    if (activity && !formData.favoriteActivities.includes(activity)) {
      setFormData({
        ...formData,
        favoriteActivities: [...formData.favoriteActivities, activity],
      });
    }
  };

  const removeCapability = (capability: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((c) => c !== capability),
    });
  };
  const removeSystemAccess = (access: string) => {
    setFormData({
      ...formData,
      systemAccess: formData.systemAccess.filter((a) => a !== access),
    });
  };

  const removePersonalityTrait = (trait: string) => {
    setFormData({
      ...formData,
      personalityTraits: formData.personalityTraits.filter((t) => t !== trait),
    });
  };

  const removeFavoriteActivity = (activity: string) => {
    setFormData({
      ...formData,
      favoriteActivities: formData.favoriteActivities.filter(
        (a) => a !== activity
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.role && formData.description) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="font-mono">
            Friend's Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="What should we call your construct friend?"
            className="font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="role" className="font-mono">
            Their Role
          </Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Creative Partner, System Architect, Data Wizard"
            className="font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="font-mono">
            About Your Friend
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe what makes this construct special and how they help you..."
            className="font-mono resize-none"
            rows={3}
            required
          />
        </div>
      </div>

      {/* Avatar Selection */}
      <div>
        <Label className="font-mono mb-3 block">Choose Their Avatar</Label>
        <div className="grid grid-cols-5 gap-2">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => setFormData({ ...formData, avatar })}
              className={`w-12 h-12 rounded-xl text-2xl transition-all duration-200 ${
                formData.avatar === avatar
                  ? "bg-primary/20 border-2 border-primary scale-110"
                  : "bg-primary/5 border border-primary/20 hover:bg-primary/10"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <Label className="font-mono mb-3 block">Their Capabilities</Label>

        {/* Preset Capabilities */}
        <div className="mb-4">
          <p className="text-sm text-primary/60 font-mono mb-2">Quick Add:</p>
          <div className="flex flex-wrap gap-2">
            {capabilityPresets.map((capability) => (
              <button
                key={capability}
                type="button"
                onClick={() => addCapability(capability)}
                disabled={formData.capabilities.includes(capability)}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {capability}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Capability Input */}
        <div className="flex gap-2 mb-3">
          <Input
            value={newCapability}
            onChange={(e) => setNewCapability(e.target.value)}
            placeholder="Add custom capability..."
            className="font-mono"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCapability(newCapability);
                setNewCapability("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addCapability(newCapability);
              setNewCapability("");
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Capabilities */}
        {formData.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.capabilities.map((capability) => (
              <span
                key={capability}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-mono rounded-lg border border-blue-500/30 flex items-center gap-2"
              >
                {capability}
                <button
                  type="button"
                  onClick={() => removeCapability(capability)}
                  className="text-blue-300 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* System Access */}
      <div>
        <Label className="font-mono mb-3 block flex items-center gap-2">
          <Shield className="w-4 h-4" />
          System Access Permissions
        </Label>

        {/* Preset System Access */}
        <div className="mb-4">
          <p className="text-sm text-primary/60 font-mono mb-2">
            Grant Access To:
          </p>
          <div className="flex flex-wrap gap-2">
            {systemAccessOptions.map((access) => (
              <button
                key={access}
                type="button"
                onClick={() => addSystemAccess(access)}
                disabled={formData.systemAccess.includes(access)}
                className="px-3 py-1 bg-orange-500/10 text-orange-300 text-xs font-mono rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {access}
              </button>
            ))}
          </div>
        </div>

        {/* Custom System Access Input */}
        <div className="flex gap-2 mb-3">
          <Input
            value={newSystemAccess}
            onChange={(e) => setNewSystemAccess(e.target.value)}
            placeholder="Grant custom system access..."
            className="font-mono"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSystemAccess(newSystemAccess);
                setNewSystemAccess("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addSystemAccess(newSystemAccess);
              setNewSystemAccess("");
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected System Access */}
        {formData.systemAccess.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.systemAccess.map((access) => (
              <span
                key={access}
                className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm font-mono rounded-lg border border-orange-500/30 flex items-center gap-2"
              >
                {access}
                <button
                  type="button"
                  onClick={() => removeSystemAccess(access)}
                  className="text-orange-300 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 font-mono gap-2">
          <Save className="w-4 h-4" />
          Create Friend
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="font-mono gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
};
