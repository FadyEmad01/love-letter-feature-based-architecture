"use client";

import bgImage from "@/assets/images/bg-hero.webp";
import { LANDING_CONTENT } from "../constants";
import { HeroSection } from "./hero-section";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <HeroSection
        tagline={LANDING_CONTENT.hero.tagline}
        title={LANDING_CONTENT.hero.title}
        description={LANDING_CONTENT.hero.description}
        landscapeImage={bgImage.src}
        landscapeBlurDataURL={bgImage.blurDataURL}
        landscapeAlt={LANDING_CONTENT.hero.landscapeAlt}
        animation="subtle"
        variant="standard"
        primaryCTA={LANDING_CONTENT.primaryCTA}
        secondaryCTA={LANDING_CONTENT.secondaryCTA}
      />
    </main>
  );
}
