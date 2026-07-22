"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DecorativeBackground } from "@/features/dashboard/components/decorative-background";
import { useLogout } from "@/features/dashboard/hooks/use-logout";

interface DashboardShellProps {
  userName: string;
  children: ReactNode;
}

export function DashboardShell({ userName, children }: DashboardShellProps) {
  const { isLoggingOut, handleLogout } = useLogout();
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden selection:bg-brand-pink/30">
      <DecorativeBackground />

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen max-w-[1400px] mx-auto">
        <main className="flex-1 p-6 md:p-12 pb-24 md:pb-12 overflow-y-auto">
          <DashboardHeader
            userName={userName}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
            onAvatarClick={() => router.push("/dashboard/profile")}
          />

          {children}
        </main>
      </div>
    </div>
  );
}
