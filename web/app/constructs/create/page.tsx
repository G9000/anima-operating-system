"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/base";

import type { CreateConstructData } from "@/app/components/avatar/types";

export default function Page() {
  const router = useRouter();
  const handleSave = (constructData: CreateConstructData) => {
    // TODO: Implement actual save logic (localStorage, API, context, etc.)
    console.log("Saving construct:", constructData);

    // For now, just redirect back to the avatar-os app
    router.push("/apps/avatar-os");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 font-mono text-primary/70 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-mono font-semibold text-foreground tracking-tight">
                Create New Construct
              </h1>
              <p className="text-foreground/60 font-mono text-sm">
                Design your new AI companion with detailed personality and
                capabilities
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">asd</div>
    </div>
  );
}
