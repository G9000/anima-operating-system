"use client";

import { useRouter } from "next/navigation";
import { AuthDialog } from "@/app/components/core";
import { Dashboard, apps } from "@/app/components/dashboard";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleAppClick = (appId: string) => {
    console.log(`Launching app: ${appId}`);
    // Navigate to the app's dedicated page
    router.push(`/apps/${appId}`);
  };

  const handleManageClick = () => {
    console.log("Opening system management");
    // Navigate to system management page
    router.push("/system/manage");
  };

  return (
    <main className="relative min-h-screen w-full ">
      {user ? (
        <Dashboard
          apps={apps}
          onAppClick={handleAppClick}
          onManageClick={handleManageClick}
        />
      ) : (
        <AuthDialog />
      )}
    </main>
  );
}
