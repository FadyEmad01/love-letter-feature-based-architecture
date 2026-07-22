"use client";

import { DashboardIntro } from "@/features/dashboard/components/dashboard-intro";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { HomeView } from "@/features/dashboard/components/home-view";
import { useIntroPhase } from "@/features/dashboard/hooks/use-intro-phase";

interface DashboardViewProps {
  sessionId: string;
  userName: string;
  hasSeenIntro: boolean;
}

export function DashboardView({
  sessionId,
  userName,
  hasSeenIntro,
}: DashboardViewProps) {
  const { phase, handleIntroComplete, handleExitComplete } = useIntroPhase({
    hasSeenIntro,
    sessionId,
  });

  if (phase === "dashboard") {
    return (
      <DashboardShell userName={userName}>
        <HomeView />
      </DashboardShell>
    );
  }

  return (
    <DashboardIntro
      phase={phase}
      userName={userName}
      onAnimationComplete={
        phase === "intro" ? handleIntroComplete : handleExitComplete
      }
    />
  );
}
