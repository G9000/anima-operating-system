"use client";

import { AuthDialog } from "@/app/components/core";
import {
  MessageSquare,
  UserCircle2,
  Layout,
  ArrowRight,
  Settings,
  FileText,
  Code,
  Terminal,
  Sparkles,
  Brain,
  Search,
  Bell,
  Zap,
  Activity,
  Cpu,
  MemoryStick,
  Wifi,
  HardDrive,
  Shield,
  Globe,
  Clock,
  Power,
} from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { cn } from "./lib/utils";

const apps = [
  {
    id: "avatar-os",
    name: "Avatar OS",
    description: "Persona atelier & management",
    icon: UserCircle2,
    category: "Core",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    id: "neural-forge",
    name: "Neural Forge",
    description: "AI model training & deployment",
    icon: Brain,
    category: "AI",
    status: "beta",
    color: "from-primary/8 to-primary/3",
    iconColor: "text-primary/80",
    borderColor: "border-primary/20",
  },
  {
    id: "system-shell",
    name: "System Shell",
    description: "Advanced terminal interface",
    icon: Terminal,
    category: "System",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    id: "code-nexus",
    name: "Code Nexus",
    description: "Integrated development environment",
    icon: Code,
    category: "Dev",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    id: "data-streams",
    name: "Data Streams",
    description: "Real-time analytics & visualization",
    icon: Layout,
    category: "Analytics",
    status: "coming-soon",
    color: "from-primary/6 to-primary/2",
    iconColor: "text-primary/60",
    borderColor: "border-primary/15",
  },
  {
    id: "comm-hub",
    name: "Comm Hub",
    description: "Multi-channel communication center",
    icon: MessageSquare,
    category: "Communication",
    status: "active",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/3">
      {/* Enhanced animated background elements with depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orbs with different sizes and animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000 opacity-40" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-primary/4 rounded-full blur-2xl animate-pulse delay-500 opacity-50" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary/6 rounded-full blur-xl animate-float opacity-30" />

        {/* Animated grid pattern with subtle movement */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

        {/* Rotating gradient with enhanced complexity */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full animate-spin-slow opacity-40" />

        {/* Scanning effect lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent h-1 animate-scan-line opacity-60" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.015] to-transparent w-1 animate-scan-line opacity-40"
          style={{ animationDelay: "4s" }}
        />

        {/* Data flow particles */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-data-flow opacity-50" />
        <div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/15 to-transparent animate-data-flow opacity-30"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Matrix-style character rain */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute matrix-char"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {String.fromCharCode(0x30a0 + Math.random() * 96)}
            </div>
          ))}
        </div>
      </div>

      {user ? (
        <div className="relative z-10 container mx-auto px-6 py-8">
          {/* Enhanced System Status with Real-time Monitoring */}
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Status Panel */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-30" />
                  </div>
                  <div>
                    <span className="font-mono text-base font-semibold text-foreground">
                      System Status: Online
                    </span>
                    <p className="text-xs text-primary/60 font-mono">
                      All systems operational
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary/60" />
                  <div className="text-xs font-mono text-primary/50">
                    Uptime: 127h 34m
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-primary/60" />
                    <div className="text-xs font-mono text-primary/60">CPU</div>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground">
                    45%
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: "45%" }}
                    />
                  </div>
                  <div className="text-xs font-mono text-primary/50 mt-1">
                    2.4 GHz
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="w-4 h-4 text-primary/60" />
                    <div className="text-xs font-mono text-primary/60">
                      Memory
                    </div>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground">
                    2.1GB
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: "68%" }}
                    />
                  </div>
                  <div className="text-xs font-mono text-primary/50 mt-1">
                    of 3.2GB
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-primary/60" />
                    <div className="text-xs font-mono text-primary/60">
                      Network
                    </div>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground">
                    Active
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full animate-pulse transition-all duration-500"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <div className="text-xs font-mono text-primary/50 mt-1">
                    125 Mbps
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-primary/60" />
                    <div className="text-xs font-mono text-primary/60">
                      Storage
                    </div>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground">
                    247GB
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: "30%" }}
                    />
                  </div>
                  <div className="text-xs font-mono text-primary/50 mt-1">
                    of 1TB
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Activity Panel */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary/70" />
                  <h3 className="font-mono font-semibold text-foreground">
                    Security
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/60">
                      Firewall
                    </span>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/60">
                      Encryption
                    </span>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/60">
                      Auth Layer
                    </span>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-primary/70" />
                  <h3 className="font-mono font-semibold text-foreground">
                    Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-mono text-primary/60">
                    Last login: 2 hours ago
                  </div>
                  <div className="text-xs font-mono text-primary/60">
                    Active sessions: 3
                  </div>
                  <div className="text-xs font-mono text-primary/60">
                    Background tasks: 12
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Applications Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-mono font-bold text-foreground mb-2">
                  System Applications
                </h2>
                <p className="text-sm font-mono text-primary/60">
                  {apps.filter((app) => app.status === "active").length} active
                  • {apps.filter((app) => app.status === "beta").length} beta •{" "}
                  {apps.filter((app) => app.status === "coming-soon").length}{" "}
                  pending
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all duration-300 group"
              >
                <Settings className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-mono text-primary/60 group-hover:text-primary transition-colors">
                  MANAGE
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apps.map((app, index) => {
                const IconComponent = app.icon;

                return (
                  <div
                    key={app.id}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border transition-all duration-700 hover:scale-[1.02]",
                      "bg-gradient-to-br backdrop-blur-md cursor-pointer",
                      "hover:shadow-2xl hover:shadow-primary/10",
                      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
                      app.color,
                      app.borderColor,
                      "animate-fade-in-up"
                    )}
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    {/* Enhanced Status indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold",
                          "backdrop-blur-sm border shadow-lg",
                          app.status === "active" &&
                            "bg-primary/25 text-primary border-primary/40 shadow-primary/20",
                          app.status === "beta" &&
                            "bg-primary/20 text-primary/80 border-primary/30 shadow-primary/15",
                          app.status === "coming-soon" &&
                            "bg-primary/15 text-primary/60 border-primary/25 shadow-primary/10"
                        )}
                      >
                        {app.status.replace("-", " ")}
                      </div>
                    </div>

                    <div className="relative z-10 p-8">
                      <div className="flex items-start gap-5 mb-6">
                        <div
                          className={cn(
                            "relative p-4 rounded-xl border transition-all duration-500",
                            "bg-background/60 group-hover:bg-background/80 backdrop-blur-sm",
                            "group-hover:scale-110 group-hover:rotate-3",
                            app.borderColor,
                            "shadow-lg shadow-primary/5 group-hover:shadow-primary/10"
                          )}
                        >
                          <IconComponent
                            className={cn(
                              "w-7 h-7 transition-all duration-300",
                              app.iconColor
                            )}
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono font-bold text-xl text-foreground mb-2 truncate group-hover:text-primary transition-colors duration-300">
                            {app.name}
                          </h3>
                          <p className="text-primary/70 text-sm font-mono leading-relaxed">
                            {app.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-primary/50 font-mono font-semibold">
                          ANIMA_OS::{app.category.toUpperCase()}
                        </span>

                        <div
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-500",
                            "text-primary/60 group-hover:text-primary",
                            "bg-primary/5 group-hover:bg-primary/15 border border-primary/20",
                            "transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          )}
                        >
                          <span>LAUNCH</span>
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-xl"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Quick Actions with Performance Insights */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-mono font-bold text-foreground mb-2">
                  System Control Center
                </h3>
                <p className="text-sm font-mono text-primary/60">
                  Management utilities and performance monitoring
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all duration-300 group btn-primary"
              >
                <Zap className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-mono text-primary/60 group-hover:text-primary transition-colors">
                  OPTIMIZE
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                type="button"
                className="group p-6 rounded-xl bg-card/40 border border-primary/20 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-primary/10 hover:scale-105 card-enhanced"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                    <FileText className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-foreground block group-hover:text-primary transition-colors duration-300 text-lg">
                      System Logs
                    </span>
                    <span className="text-xs font-mono text-primary/60 mt-2 block">
                      Real-time diagnostics
                    </span>
                    <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono">
                      247 entries
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="group p-6 rounded-xl bg-card/40 border border-primary/20 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-primary/10 hover:scale-105 card-enhanced"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                    <Settings className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-foreground block group-hover:text-primary transition-colors duration-300 text-lg">
                      Configuration
                    </span>
                    <span className="text-xs font-mono text-primary/60 mt-2 block">
                      Core system settings
                    </span>
                    <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono">
                      12 modules
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="group p-6 rounded-xl bg-card/40 border border-primary/20 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-primary/10 hover:scale-105 card-enhanced"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                    <Terminal className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-foreground block group-hover:text-primary transition-colors duration-300 text-lg">
                      Neural Shell
                    </span>
                    <span className="text-xs font-mono text-primary/60 mt-2 block">
                      Advanced CLI interface
                    </span>
                    <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono">
                      Ready
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="group p-6 rounded-xl bg-card/40 border border-primary/20 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-primary/10 hover:scale-105 card-enhanced"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                    <Globe className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-foreground block group-hover:text-primary transition-colors duration-300 text-lg">
                      Network Hub
                    </span>
                    <span className="text-xs font-mono text-primary/60 mt-2 block">
                      Connection management
                    </span>
                    <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono">
                      Online
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Performance Metrics Dashboard */}
            <div className="mt-12 p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    Performance Analytics
                  </h3>
                </div>
                <div className="text-xs font-mono text-primary/60">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-background/30 border border-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono text-primary/60">
                      Response Time
                    </span>
                    <Zap className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground mb-2">
                    12ms
                  </div>
                  <div className="text-xs font-mono text-primary/50">
                    Avg over 24h
                  </div>
                  <div className="mt-3 w-full bg-primary/10 rounded-full h-1 progress-enhanced">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-1000"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono text-primary/60">
                      Throughput
                    </span>
                    <Activity className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground mb-2">
                    1.2k/s
                  </div>
                  <div className="text-xs font-mono text-primary/50">
                    Operations per second
                  </div>
                  <div className="mt-3 w-full bg-primary/10 rounded-full h-1 progress-enhanced">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-1000"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono text-primary/60">
                      Efficiency
                    </span>
                    <Brain className="w-4 h-4 text-primary/60" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground mb-2">
                    94.7%
                  </div>
                  <div className="text-xs font-mono text-primary/50">
                    Neural optimization
                  </div>
                  <div className="mt-3 w-full bg-primary/10 rounded-full h-1 progress-enhanced">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-1000"
                      style={{ width: "95%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Terminal Preview */}
            <div className="mt-12 p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    Neural Shell {/* Live Feed */}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-primary/60">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-background/60 rounded-lg border border-primary/10 p-4 font-mono text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-primary/60">
                      anima@neural-core:~$
                    </span>
                    <span className="text-foreground animate-typing">
                      system status --comprehensive
                    </span>
                  </div>
                  <div className="text-primary/70 text-xs">
                    ✓ Neural networks: 6 active, 2 training
                  </div>
                  <div className="text-primary/70 text-xs">
                    ✓ Memory optimization: 94.7% efficiency
                  </div>
                  <div className="text-primary/70 text-xs">
                    ✓ Background processes: All systems nominal
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-primary/60">
                      anima@neural-core:~$
                    </span>
                    <span className="text-primary/40">|</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Shortcuts & Keyboard Commands */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    Quick Commands
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      id: "terminal",
                      key: "Ctrl + Shift + T",
                      action: "Open Neural Terminal",
                    },
                    {
                      id: "avatar",
                      key: "Ctrl + Shift + A",
                      action: "Launch Avatar OS",
                    },
                    {
                      id: "neural",
                      key: "Ctrl + Shift + N",
                      action: "Neural Forge Quick Start",
                    },
                    {
                      id: "system",
                      key: "Ctrl + Shift + S",
                      action: "System Overview",
                    },
                    {
                      id: "logs",
                      key: "Ctrl + Shift + L",
                      action: "View System Logs",
                    },
                  ].map((cmd) => (
                    <div
                      key={cmd.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300"
                    >
                      <span className="text-sm font-mono text-foreground">
                        {cmd.action}
                      </span>
                      <div className="flex items-center gap-1">
                        {cmd.key.split(" + ").map((key, i) => (
                          <span
                            key={`${cmd.id}-${key}-${i}`}
                            className="px-2 py-1 text-xs font-mono bg-primary/20 text-primary rounded border border-primary/30"
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    AI Assistant Status
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/70">
                      Neural Processing
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs font-mono text-primary">
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/70">
                      Language Models
                    </span>
                    <span className="text-xs font-mono text-primary/60">
                      4 Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-primary/70">
                      Response Time
                    </span>
                    <span className="text-xs font-mono text-primary/60">
                      ~127ms
                    </span>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-background/30 border border-primary/10">
                    <div className="text-xs font-mono text-primary/60 mb-2">
                      Last Query:
                    </div>
                    <div className="text-sm font-mono text-foreground">
                      "Optimize neural network performance"
                    </div>
                    <div className="text-xs font-mono text-primary/50 mt-1">
                      2 minutes ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health Dashboard */}
          <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    System Health Matrix
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-primary/60">
                    Real-time
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    name: "Core Temp",
                    value: "42°C",
                    status: "optimal",
                    icon: Cpu,
                  },
                  {
                    name: "Power Draw",
                    value: "65W",
                    status: "normal",
                    icon: Zap,
                  },
                  {
                    name: "Data Flow",
                    value: "2.4Gb/s",
                    status: "high",
                    icon: Activity,
                  },
                  {
                    name: "Processes",
                    value: "247",
                    status: "stable",
                    icon: Terminal,
                  },
                ].map((metric) => {
                  const IconComponent = metric.icon;
                  return (
                    <div
                      key={metric.name}
                      className="p-4 rounded-lg bg-background/30 border border-primary/10 hover:bg-background/40 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-primary/60" />
                        <span className="text-xs font-mono text-primary/60">
                          {metric.name}
                        </span>
                      </div>
                      <div className="text-lg font-mono font-bold text-foreground">
                        {metric.value}
                      </div>
                      <div
                        className={cn(
                          "text-xs font-mono mt-1 px-2 py-1 rounded-full inline-block",
                          metric.status === "optimal" &&
                            "bg-primary/20 text-primary",
                          metric.status === "normal" &&
                            "bg-primary/15 text-primary/80",
                          metric.status === "high" &&
                            "bg-primary/25 text-primary",
                          metric.status === "stable" &&
                            "bg-primary/20 text-primary"
                        )}
                      >
                        {metric.status}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Neural Network Visualization */}
              <div className="relative h-32 rounded-lg bg-background/30 border border-primary/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs font-mono text-primary/50">
                    Neural Activity Visualization
                  </div>
                </div>
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`neural-${i}`}
                      className="absolute w-2 h-2 bg-primary/40 rounded-full animate-pulse"
                      style={{
                        left: `${10 + (i % 4) * 20}%`,
                        top: `${20 + Math.floor(i / 4) * 25}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${2 + Math.random()}s`,
                      }}
                    />
                  ))}
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0"
                        />
                        <stop
                          offset="50%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={`line-${i}`}
                        x1={`${15 + (i % 3) * 25}%`}
                        y1={`${30 + Math.floor(i / 3) * 30}%`}
                        x2={`${25 + ((i + 1) % 3) * 25}%`}
                        y2={`${40 + Math.floor((i + 1) / 3) * 30}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      time: "2m ago",
                      event: "Neural Forge training completed",
                      type: "success",
                    },
                    {
                      time: "5m ago",
                      event: "System optimization executed",
                      type: "info",
                    },
                    {
                      time: "12m ago",
                      event: "Avatar OS persona updated",
                      type: "update",
                    },
                    {
                      time: "18m ago",
                      event: "Memory cache cleared",
                      type: "maintenance",
                    },
                    {
                      time: "23m ago",
                      event: "Network connection established",
                      type: "info",
                    },
                  ].map((activity, index) => (
                    <div
                      key={`activity-${index}`}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background/20 border border-primary/5 hover:bg-background/30 transition-colors duration-300"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          activity.type === "success" &&
                            "bg-primary animate-pulse",
                          activity.type === "info" && "bg-primary/70",
                          activity.type === "update" && "bg-primary/60",
                          activity.type === "maintenance" && "bg-primary/50"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono text-foreground">
                          {activity.event}
                        </div>
                        <div className="text-xs font-mono text-primary/50">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Resources */}
              <div className="p-6 rounded-2xl bg-card/40 border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive className="w-5 h-5 text-primary/70" />
                  <h3 className="text-lg font-mono font-semibold text-foreground">
                    Resources
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Neural Cache", used: 85, total: 100, unit: "GB" },
                    {
                      name: "Process Queue",
                      used: 12,
                      total: 50,
                      unit: "tasks",
                    },
                    {
                      name: "API Requests",
                      used: 1247,
                      total: 5000,
                      unit: "/hr",
                    },
                  ].map((resource) => (
                    <div key={resource.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono text-primary/70">
                          {resource.name}
                        </span>
                        <span className="text-xs font-mono text-primary/50">
                          {resource.used}/{resource.total} {resource.unit}
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 rounded-full h-2 progress-enhanced">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${(resource.used / resource.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AuthDialog />
      )}
    </main>
  );
}
