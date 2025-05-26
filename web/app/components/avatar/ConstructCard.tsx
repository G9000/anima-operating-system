"use client";

import { useState } from "react";
import { Button } from "@/app/components/base";
import type { Construct } from "./types";

interface ConstructCardProps {
  construct: Construct;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
}

export const ConstructCard = ({
  construct,
  onEdit,
  onDelete,
  onActivate,
}: ConstructCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-foreground bg-foreground/10 border-foreground/20";
      case "idle":
        return "text-foreground/70 bg-foreground/5 border-foreground/10";
      default:
        return "text-foreground/50 bg-foreground/5 border-foreground/10";
    }
  };

  const getTrustColor = (trustLevel: string) => {
    switch (trustLevel) {
      case "full":
        return "text-foreground bg-foreground/10 border-foreground/20";
      case "trusted":
        return "text-foreground/80 bg-foreground/5 border-foreground/15";
      default:
        return "text-foreground/60 bg-foreground/5 border-foreground/10";
    }
  };

  return (
    <div className="group relative bg-background/60 backdrop-blur-md border border-border/30 rounded-xl p-4 hover:border-border/50 transition-all duration-200 hover:bg-background/80">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div
          className={`px-2 py-1 rounded-md text-xs font-mono uppercase tracking-wider border ${getStatusColor(
            construct.status
          )}`}
        >
          {construct.status}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-foreground/60 hover:text-foreground"
          >
            ⋮
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-background border border-border/30 rounded-md shadow-lg z-10 min-w-[100px]">
              <button
                type="button"
                onClick={() => {
                  onActivate();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-foreground/5 flex items-center gap-2 font-mono text-foreground/80"
              >
                <img
                  src="/icons/play.svg"
                  alt="Configure"
                  className="w-3 h-3 opacity-60"
                />
                Configure
              </button>
              <button
                type="button"
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-foreground/5 flex items-center gap-2 font-mono text-foreground/80"
              >
                <img
                  src="/icons/edit.svg"
                  alt="Evolve"
                  className="w-3 h-3 opacity-60"
                />
                Evolve
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-foreground/5 flex items-center gap-2 font-mono text-foreground/60"
              >
                <img
                  src="/icons/delete.svg"
                  alt="Retire"
                  className="w-3 h-3 opacity-40"
                />
                Retire
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-3 border border-primary/20 overflow-hidden">
          <img
            src={construct.avatar || "/animaos.webp"}
            alt={`${construct.name} avatar`}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = "/animaos.webp";
            }}
          />
        </div>{" "}
        <h3 className="text-xl font-mono font-bold text-foreground mb-1">
          {construct.name}
        </h3>
        <p className="text-sm font-mono text-primary/70 uppercase tracking-wider">
          {construct.role}
        </p>
        <p className="text-sm font-mono text-foreground/60 mt-1 mb-2">
          {construct.responsibility}
        </p>
      </div>
      {/* Trust Level & OS Control */}
      {/* Description */}
      <p className="text-sm text-primary/60 mb-4 line-clamp-2">
        {construct.description}
      </p>{" "}
      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-primary/50">
        <div className="flex items-center gap-1">{construct.lastUsed}</div>
        <div className="flex items-center gap-1">
          <span className="text-xs">◉</span>
          Construct
        </div>
      </div>{" "}
      {/* Connection Button */}
      <div className="flex justify-end">
        <Button
          onClick={onActivate}
          className="mt-4 font-mono"
          variant="outline"
        >
          Configure
        </Button>
      </div>
    </div>
  );
};
