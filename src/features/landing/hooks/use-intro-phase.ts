"use client";

import { useEffect, useState } from "react";
import { ANIMATION_TIMING, SESSION_STORAGE_KEY } from "../constants";

export function useIntroPhase(
  animate: boolean,
  duration: number = ANIMATION_TIMING.INTRO_DURATION,
) {
  const [hydrated, setHydrated] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setHydrated(true);

    if (!animate) {
      setIntroDone(true);
      return;
    }

    if (sessionStorage.getItem(SESSION_STORAGE_KEY) !== null) {
      setIntroDone(true);
      return;
    }

    // First visit — play intro, mark done after duration
    const timer = setTimeout(() => {
      setIntroDone(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    }, duration);

    return () => clearTimeout(timer);
  }, [animate, duration]);

  const introSkipped = hydrated && introDone;

  return { hydrated, introSkipped, introDone };
}
