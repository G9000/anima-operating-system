"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
} from "lucide-react";
import { Button } from "@/app/components/base";

export default function SystemManagePage() {
  const router = useRouter();

  const systemModules = [
    {
      id: "performance",
      name: "Performance Monitor",
      description: "Real-time system performance and resource usage",
      icon: Monitor,
      status: "active",
      color: "bg-gradient-to-br from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
      iconColor: "text-primary",
    },
    {
      id: "processes",
      name: "Process Manager",
      description: "Monitor and manage running applications and services",
      icon: Cpu,
      status: "active",
      color: "bg-gradient-to-br from-primary/10 to-primary/5",
      borderColor: "border-primary/30",
      iconColor: "text-primary",
    },
    {
      id: "storage",
      name: "Storage Manager",
      description: "Disk usage analysis and file system management",
      icon: HardDrive,
      status: "beta",
      color: "bg-gradient-to-br from-primary/8 to-primary/4",
      borderColor: "border-primary/25",
      iconColor: "text-primary/80",
    },
    {
      id: "network",
      name: "Network Manager",
      description: "Network connections and traffic monitoring",
      icon: Wifi,
      status: "beta",
      color: "bg-gradient-to-br from-primary/8 to-primary/4",
      borderColor: "border-primary/25",
      iconColor: "text-primary/80",
    },
    {
      id: "security",
      name: "Security Center",
      description: "System security and access control management",
      icon: Shield,
      status: "coming-soon",
      color: "bg-gradient-to-br from-primary/6 to-primary/3",
      borderColor: "border-primary/20",
      iconColor: "text-primary/60",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3"
      style={{
        backgroundImage: `
          linear-gradient(rgba(var(--primary) / 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--primary) / 0.02) 1px, transparent 1px)
        `,
        backgroundSize: "30px 30px",
        backgroundPosition: "0 0, 0 0",
      }}
    >
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-primary group-hover:translate-x-[-2px] transition-transform" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg transition-all duration-300 hover:scale-110">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold text-foreground">
                  System Management
                </h1>
                <p className="text-sm text-primary/70 font-mono">
                  ANIMA_OS::SYSTEM
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <span className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border backdrop-blur-sm bg-primary/25 text-primary border-primary/40 shadow-primary/20 shadow-lg">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-mono font-bold text-foreground mb-4">
              System Control Panel
            </h2>
            <p className="text-primary/70 font-mono text-lg">
              Monitor and manage your ANIMA Operating System components and
              resources.
            </p>
          </div>

          {/* System Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {systemModules.map((module, index) => {
              const IconComponent = module.icon;

              return (
                <div
                  key={module.id}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-700 hover:scale-[1.02] ${module.color} ${module.borderColor} hover:shadow-2xl hover:shadow-primary/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 cursor-pointer animate-fade-in-up`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    backgroundImage: `
                      linear-gradient(rgba(var(--primary) / 0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(var(--primary) / 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold backdrop-blur-sm border shadow-lg ${
                        module.status === "active"
                          ? "bg-primary/25 text-primary border-primary/40 shadow-primary/20"
                          : module.status === "beta"
                          ? "bg-primary/20 text-primary/80 border-primary/30 shadow-primary/15"
                          : "bg-primary/15 text-primary/60 border-primary/25 shadow-primary/10"
                      }`}
                    >
                      {module.status.replace("-", " ")}
                    </div>
                  </div>

                  <div className="relative z-10 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`relative p-3 rounded-xl border transition-all duration-500 bg-background/60 group-hover:bg-background/80 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 ${module.borderColor} shadow-lg shadow-primary/5 group-hover:shadow-primary/10`}
                      >
                        <IconComponent
                          className={`w-6 h-6 transition-all duration-300 ${module.iconColor}`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono font-bold text-lg text-foreground mb-2 truncate group-hover:text-primary transition-colors duration-300">
                          {module.name}
                        </h3>
                        <p className="text-primary/70 text-sm font-mono leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-primary/50 font-mono font-semibold">
                        SYSTEM_MODULE
                      </span>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-500 text-primary/60 group-hover:text-primary bg-primary/5 group-hover:bg-primary/15 border border-primary/20 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                        <span>
                          {module.status === "coming-soon" ? "PENDING" : "OPEN"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Information */}
          <div className="bg-background/60 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-mono font-bold text-foreground mb-6">
              System Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-mono text-primary/60 uppercase tracking-wider">
                  OS Version
                </div>
                <div className="text-lg font-mono font-semibold text-foreground">
                  ANIMA OS v1.0.0
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-mono text-primary/60 uppercase tracking-wider">
                  Kernel
                </div>
                <div className="text-lg font-mono font-semibold text-foreground">
                  Neural Kernel
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-mono text-primary/60 uppercase tracking-wider">
                  Architecture
                </div>
                <div className="text-lg font-mono font-semibold text-foreground">
                  x86_64
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-mono text-primary/60 uppercase tracking-wider">
                  Uptime
                </div>
                <div className="text-lg font-mono font-semibold text-foreground">
                  2d 14h 32m
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
