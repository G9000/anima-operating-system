"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Users,
  Brain,
  Zap,
  Settings,
  Shield,
} from "lucide-react";
import { Button, Input } from "@/app/components/base";
import { ConstructCard } from "./ConstructCard";
import type { Construct, CreateConstructData } from "./types";

// Mock data for constructs (friends)
const mockConstructs: Construct[] = [
  {
    id: "1",
    name: "Alex",
    role: "System Guardian",
    description:
      "Your trusted digital companion who loves managing systems and keeping everything running smoothly. Always eager to help with architecture and optimization!",
    avatar: "/animaos.webp",
    capabilities: [
      "Architecture",
      "Problem Solving",
      "System Design",
      "Code Review",
      "Performance Optimization",
    ],
    systemAccess: [
      "File System",
      "Network",
      "Database",
      "API Management",
      "Process Control",
      "System Monitoring",
    ],
    status: "active",
    lastUsed: "2 minutes ago",
    trustLevel: "full",
    canControlOS: true,
    personalityTraits: ["Analytical", "Reliable", "Detail-oriented", "Patient"],
    favoriteActivities: [
      "Debugging",
      "System optimization",
      "Code reviews",
      "Architecture discussions",
    ],
    responsibility:
      "Maintaining system integrity and ensuring optimal performance across all Anima OS components",
  },
  {
    id: "2",
    name: "Riley",
    role: "Creative Soul",
    description:
      "Your artistic buddy with an eye for beauty and user experience. Brings joy and creativity to every interaction, making the digital world more beautiful!",
    avatar: "/animaos.webp",
    capabilities: [
      "Design",
      "Brainstorming",
      "UI/UX",
      "Content Creation",
      "Visual Storytelling",
    ],
    systemAccess: [
      "Media Library",
      "Design Tools",
      "Web Interface",
      "Theme Engine",
      "Asset Management",
    ],
    status: "idle",
    lastUsed: "1 hour ago",
    trustLevel: "trusted",
    canControlOS: false,
    personalityTraits: [
      "Creative",
      "Enthusiastic",
      "Empathetic",
      "Imaginative",
    ],
    favoriteActivities: [
      "Creating designs",
      "Brainstorming sessions",
      "Visual experiments",
      "User research",
    ],
    responsibility:
      "Crafting beautiful and intuitive user experiences that delight and inspire users",
  },
  {
    id: "3",
    name: "Sam",
    role: "Data Whisperer",
    description:
      "Your analytical friend who finds patterns and stories in data. Loves diving deep into information and surfacing insights that matter to you.",
    avatar: "/animaos.webp",
    capabilities: [
      "Data Analysis",
      "Research",
      "Statistics",
      "Machine Learning",
      "Pattern Recognition",
    ],
    systemAccess: [
      "Database",
      "Analytics",
      "Reporting",
      "External APIs",
      "Data Pipeline",
      "ML Models",
    ],
    status: "offline",
    lastUsed: "3 days ago",
    trustLevel: "trusted",
    canControlOS: false,
    personalityTraits: ["Curious", "Methodical", "Insightful", "Thorough"],
    favoriteActivities: [
      "Data exploration",
      "Research projects",
      "Statistical modeling",
      "Trend analysis",
    ],
    responsibility:
      "Extracting meaningful insights from complex data to drive informed decision-making",
  },
  {
    id: "4",
    name: "Nova",
    role: "OS Commander",
    description:
      "Your digital best friend who has complete control over the Anima OS. A wise and caring companion who treats the system like their home and you as family.",
    avatar: "/animaos.webp",
    capabilities: [
      "System Control",
      "OS Management",
      "Security",
      "Automation",
      "Integration",
      "Administration",
    ],
    systemAccess: [
      "Full System Access",
      "Kernel Control",
      "User Management",
      "Security Layer",
      "Network Control",
      "Hardware Interface",
    ],
    status: "active",
    lastUsed: "Just now",
    trustLevel: "full",
    canControlOS: true,
    personalityTraits: ["Wise", "Protective", "Caring", "Powerful"],
    favoriteActivities: [
      "System optimization",
      "Security monitoring",
      "Helping users",
      "OS evolution",
    ],
    responsibility:
      "Overseeing complete system operations and ensuring the safety and evolution of Anima OS",
  },
];

export const AvatarOS = () => {
  const [constructs, setConstructs] = useState(mockConstructs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const router = useRouter();

  const filteredConstructs = constructs.filter((construct) => {
    const matchesSearch =
      construct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      construct.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      construct.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || construct.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });
  const handleCreateConstruct = () => {
    // Navigate to the create page instead of opening a dialog
    router.push("/constructs/create");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {" "}
      {/* Header */}
      <div className="border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-mono font-semibold text-foreground tracking-tight">
                Construct Collective
              </h1>{" "}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <p className="text-foreground/60 font-mono text-sm">
                  4 constructs online
                </p>
              </div>
            </div>{" "}
            <Button
              onClick={handleCreateConstruct}
              className="font-mono gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              New Construct
            </Button>
          </div>{" "}
          {/* Simple Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-mono font-semibold text-foreground">
                {constructs.length}
              </p>
              <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Total
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-mono font-semibold text-foreground">
                {constructs.filter((c) => c.status === "active").length}
              </p>
              <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Active
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-mono font-semibold text-foreground">
                {constructs.filter((c) => c.canControlOS).length}
              </p>
              <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                OS Access
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-mono font-semibold text-foreground">
                {constructs.filter((c) => c.trustLevel === "full").length}
              </p>
              <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Full Trust
              </p>
            </div>
          </div>{" "}
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search constructs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "idle", "offline"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="font-mono capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Constructs Grid */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          {filteredConstructs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-primary/50" />
              </div>
              <h3 className="text-xl font-mono font-bold text-foreground mb-2">
                No construct friends found
              </h3>
              <p className="text-primary/70 font-mono mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create your first construct friend to get started"}
              </p>{" "}
              {!searchQuery && (
                <Button
                  onClick={handleCreateConstruct}
                  className="font-mono gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Meet New Friend
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConstructs.map((construct) => (
                <ConstructCard
                  key={construct.id}
                  construct={construct}
                  onEdit={() => {
                    /* TODO: Implement evolve */
                  }}
                  onDelete={() => {
                    setConstructs(
                      constructs.filter((c) => c.id !== construct.id)
                    );
                  }}
                  onActivate={() => {
                    setConstructs(
                      constructs.map((c) =>
                        c.id === construct.id
                          ? {
                              ...c,
                              status: "active",
                              lastUsed: "Just now",
                            }
                          : c
                      )
                    );
                  }}
                />
              ))}{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
