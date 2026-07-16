"use client";

import { useIntroPhase } from "../hooks/use-intro-phase";
import { DashboardIntro } from "./dashboard-intro";
import { DashboardShell } from "./dashboard-shell";

interface DashboardViewProps {
  sessionId: string;
  userName: string;
  userEmail: string;
  hasSeenIntro: boolean;
}

export function DashboardView({
  sessionId,
  userName,
  userEmail,
  hasSeenIntro,
}: DashboardViewProps) {
  const { phase, handleIntroComplete, handleExitComplete } = useIntroPhase({
    hasSeenIntro,
    sessionId,
  });

  if (phase === "dashboard") {
    return <DashboardShell userName={userName} userEmail={userEmail} />;
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
