"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IntroPhase } from "../types/intro";

const INTRO_STORAGE_KEY_PREFIX = "intro_seen_";

interface UseIntroPhaseOptions {
  hasSeenIntro: boolean;
  sessionId: string;
}

export function useIntroPhase({
  hasSeenIntro,
  sessionId,
}: UseIntroPhaseOptions) {
  const [phase, setPhase] = useState<IntroPhase>(
    hasSeenIntro ? "dashboard" : "intro",
  );
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (pauseTimer.current !== null) {
      clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
    if (exitTimer.current !== null) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleIntroComplete = useCallback(() => {
    setPhase("pausing");
    pauseTimer.current = setTimeout(() => {
      setPhase("exit");
    }, 1500);
  }, []);

  const handleExitComplete = useCallback(() => {
    setPhase((prev) => {
      if (prev !== "exit") return prev;
      localStorage.setItem(`${INTRO_STORAGE_KEY_PREFIX}${sessionId}`, "1");
      // biome-ignore lint/suspicious/noDocumentCookie: Intentional — cookie is read server-side for SSR intro skip
      document.cookie = `dashboard_intro_seen=${sessionId}; path=/; max-age=31536000; SameSite=Lax`;
      return "dashboard";
    });
  }, [sessionId]);

  return { phase, handleIntroComplete, handleExitComplete };
}
