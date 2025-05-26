"use client";

// import { SystemHeader } from "./SystemHeader";
import { ApplicationGrid } from "./ApplicationGrid";
import type { App, SystemStats } from "./types";

interface DashboardProps {
  apps: App[];
  onAppClick?: (appId: string) => void;
  onManageClick?: () => void;
}

export function Dashboard({ apps, onAppClick, onManageClick }: DashboardProps) {
  const stats: SystemStats = {
    active: apps.filter((app) => app.status === "active").length,
    beta: apps.filter((app) => app.status === "beta").length,
    pending: apps.filter((app) => app.status === "coming-soon").length,
  };

  return (
    <div className="relative z-10 container mx-auto px-6 py-8">
      {/* <SystemHeader stats={stats} onManageClick={onManageClick} /> */}
      <ApplicationGrid apps={apps} onAppClick={onAppClick} />
    </div>
  );
}
