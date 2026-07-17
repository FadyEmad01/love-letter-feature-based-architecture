/** Hero content and CTA configuration */
export const LANDING_CONTENT = {
  hero: {
    tagline: "A love letter platform",
    title: "Digital letters for your loved ones",
    description:
      "Create beautiful, interactive open-when letter collections to give to your loved ones. Personalize every word, choose the perfect moment, and let your love speak across time.",
    landscapeAlt: "Love letter hero background",
  },
  primaryCTA: {
    ctaEnabled: true,
    text: "Explore Now",
    link: "/auth/register",
    variant: "default" as const,
    size: "lg" as const,
  },
  secondaryCTA: {
    ctaEnabled: true,
    text: "Read Our Story",
    link: "/about",
    variant: "outline" as const,
    size: "lg" as const,
  },
} as const;

/** Animation timing constants (in ms or seconds — see usage) */
export const ANIMATION_TIMING = {
  /** Duration of the ink intro before content reveal (ms) */
  INTRO_DURATION: 4500,
  /** Delay before container starts revealing (seconds) */
  CONTENT_DELAY: 6,
  /** Delay between child elements cascading (seconds) */
  STAGGER_CHILDREN: 0.1,
  /** Delay before children start cascading after container (seconds) */
  DELAY_CHILDREN: 6.45,
} as const;

/** Path to the ink mask GIF used in the intro animation */
export const INK_MASK_PATH = "/gif/ink.gif";

/** sessionStorage key for tracking whether the intro has been seen */
export const SESSION_STORAGE_KEY = "landing-intro-seen";
