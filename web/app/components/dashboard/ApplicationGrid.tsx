"use client";

import { AppCard } from "./AppCard";
import type { App } from "./types";

interface ApplicationGridProps {
  apps: App[];
  onAppClick?: (appId: string) => void;
}

export function ApplicationGrid({ apps, onAppClick }: ApplicationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} onClick={onAppClick} />
      ))}
    </div>
  );
}
