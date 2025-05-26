"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { App } from "./types";

interface AppCardProps {
  app: App;
  index: number;
  onClick?: (appId: string) => void;
}

export function AppCard({ app, index, onClick }: AppCardProps) {
  const IconComponent = app.icon;
  const handleClick = () => {
    if (onClick) {
      onClick(app.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
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
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Launch ${app.name} application`}
    >
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
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    </div>
  );
}
