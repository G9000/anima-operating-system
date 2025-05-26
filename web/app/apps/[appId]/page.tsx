"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apps } from "@/app/components/dashboard";
import { Button } from "@/app/components/base";
import { ChatInterface } from "@/app/components/chat";
import { AvatarOS, ConstructOS } from "@/app/components/avatar";

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.appId as string;

  // Find the app by ID
  const app = apps.find((a) => a.id === appId);

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/3">
        <div className="text-center space-y-6">
          <div className="p-8 bg-background/60 backdrop-blur-md border border-border/50 rounded-2xl">
            <h1 className="text-2xl font-mono font-bold text-foreground mb-4">
              App Not Found
            </h1>
            <p className="text-primary/70 font-mono mb-6">
              The requested application "{appId}" does not exist.
            </p>
            <Button onClick={() => router.push("/")} className="font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = app.icon;

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
      {/* <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-primary group-hover:translate-x-[-2px] transition-transform" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl border ${app.borderColor} ${app.color} shadow-lg transition-all duration-300 hover:scale-110`}
              >
                <IconComponent className={`w-6 h-6 ${app.iconColor}`} />
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold text-foreground">
                  {app.name}
                </h1>
                <p className="text-sm text-primary/70 font-mono">
                  ANIMA_OS::{app.category.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border backdrop-blur-sm ${
                  app.status === "active"
                    ? "bg-primary/25 text-primary border-primary/40 shadow-primary/20"
                    : app.status === "beta"
                    ? "bg-primary/20 text-primary/80 border-primary/30 shadow-primary/15"
                    : "bg-primary/15 text-primary/60 border-primary/25 shadow-primary/10"
                } shadow-lg`}
              >
                {app.status.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>
      </header> */}{" "}
      {/* App Content */}
      <div className="container mx-auto h-screen">
        {appId === "avatar-chat" && <ChatInterface />}
        {appId === "avatar-os" && <ConstructOS />}
      </div>
    </div>
  );
}
