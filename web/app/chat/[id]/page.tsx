"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/base";
import { ChatInterface } from "@/app/components/chat";
import { useAuth } from "@/app/hooks/useAuth";
import { AuthDialog } from "@/app/components/core";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const chatId = params.id as string;

  if (!user) {
    return <AuthDialog />;
  }

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
              type="button"
              onClick={() => router.push("/")}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-primary group-hover:translate-x-[-2px] transition-transform" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg transition-all duration-300 hover:scale-110">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold text-foreground">
                  Chat Session
                </h1>
                <p className="text-sm text-primary/70 font-mono">
                  ANIMA_OS::CONVERSATION#{chatId}
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
      </header>{" "}
      {/* Chat Content */}
      <div className="container mx-auto h-[calc(100vh-80px)]">
        <ChatInterface className="h-full" threadId={chatId} />
      </div>
    </div>
  );
}
