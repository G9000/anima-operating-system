"use client";

import { Settings } from "lucide-react";
import type { SystemStats } from "./types";

interface SystemHeaderProps {
  stats: SystemStats;
  onManageClick?: () => void;
}

export function SystemHeader({ stats, onManageClick }: SystemHeaderProps) {
  const handleManageClick = () => {
    if (onManageClick) {
      onManageClick();
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-mono font-bold text-foreground mb-2">
          System Applications
        </h2>
        <p className="text-sm font-mono text-primary/60">
          {stats.active} active • {stats.beta} beta • {stats.pending} pending
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all duration-300 group"
        onClick={handleManageClick}
      >
        <Settings className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
        <span className="text-sm font-mono text-primary/60 group-hover:text-primary transition-colors">
          MANAGE
        </span>
      </button>
    </div>
  );
}
