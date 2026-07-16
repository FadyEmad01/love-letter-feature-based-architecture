"use client";

import NoiseOverlay from "@/components/background/NoiseOverlay";
import type { IntroPhase } from "../types/intro";
import { TextEffect } from "./animation/text-effect";

interface DashboardIntroProps {
  phase: IntroPhase;
  userName: string;
  onAnimationComplete: () => void;
}

export function DashboardIntro({
  phase,
  userName,
  onAnimationComplete,
}: DashboardIntroProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <NoiseOverlay />
      <TextEffect
        trigger={phase !== "exit"}
        preset="fade-in-blur"
        per="word"
        onAnimationComplete={onAnimationComplete}
        className="text-center font-advercase text-4xl md:text-6xl tracking-wide"
      >
        {`Welcome ${userName}`}
      </TextEffect>
    </div>
  );
}
