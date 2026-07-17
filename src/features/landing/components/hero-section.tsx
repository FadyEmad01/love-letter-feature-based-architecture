"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ANIMATION_TIMING, INK_MASK_PATH } from "../constants";
import { useIntroPhase } from "../hooks/use-intro-phase";
import type { Hero05Props } from "../types";
import AnimationTextHeading from "./AnimationTextHeading";
import { Cta } from "./cta";

const variantStyles = {
  standard: {
    copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
    tagline: "text-sm sm:text-base",
    title: "text-3xl sm:text-4xl md:text-5xl leading-tight",
    description: "text-sm sm:text-base",
    header: "gap-6 sm:gap-8",
    grid: "gap-10",
  },
  compact: {
    copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
    tagline: "text-sm",
    title: "text-2xl sm:text-3xl md:text-4xl",
    description: "text-sm",
    header: "gap-4 sm:gap-5",
    grid: "gap-8",
  },
} as const;

// Top curtain reveal with your updated 6s timing orchestration
// const container: Variants = {
//   hidden: {
//     opacity: 0,
//     clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)",
//   },
//   visible: {
//     opacity: 1,
//     clipPath: "inset(0% 0% 0% 0% round 0px 0px 32px 32px)",
//     transition: {
//       delay: 6, // Wait 6 seconds for the entire ink + logo intro
//       staggerChildren: 0.1,
//       delayChildren: 6.45, // Correctly synchronized to cascade text after curtain drops
//       duration: 0.8,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   },
// };

const container: Variants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: ANIMATION_TIMING.CONTENT_DELAY,
      staggerChildren: ANIMATION_TIMING.STAGGER_CHILDREN,
      delayChildren: ANIMATION_TIMING.DELAY_CHILDREN,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerInstant: Variants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0,
      staggerChildren: ANIMATION_TIMING.STAGGER_CHILDREN,
      delayChildren: 0,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Cascading text elements
const item: Variants = {
  hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const bgImageVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean;
  variants?: Variants;
  className?: string;
  children: ReactNode;
}>) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroSection({
  tagline,
  title,
  description,
  landscapeImage,
  landscapeAlt = "",
  animation = "none",
  primaryCTA,
  secondaryCTA,
  variant = "standard",
}: Readonly<Hero05Props>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];

  // Tracks when the ink intro finishes
  const { hydrated, introSkipped } = useIntroPhase(animate);

  const taglineElement = tagline && (
    <p
      className={cn(
        "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
        vs.tagline,
      )}
    >
      {tagline}
    </p>
  );

  const titleElement = title && (
    <h1
      className={cn(
        "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
        vs.title,
      )}
    >
      {title}
    </h1>
  );

  const descriptionElement = description && (
    <p
      className={cn(
        "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
        vs.description,
      )}
    >
      {description}
    </p>
  );

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
        />
      )}
    </div>
  );

  const mediaElement = landscapeImage && (
    <motion.div
      className="absolute inset-0 z-0 h-screen w-full overflow-hidden bg-background"
      variants={animate ? bgImageVariant : undefined}
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : undefined}
    >
      {/* Dimmer overlay to ensure text contrast */}
      <div
        aria-hidden
        className="absolute z-10 inset-0 pointer-events-none mix-blend-multiply"
      />
      {introSkipped && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none">
          <Image
            src={landscapeImage}
            alt={landscapeAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom brightness-[0.4] pointer-events-none"
          />
        </div>
      )}
      {/* 
        Ink-Masked Image Layer
        Swapped to next/image using fill layout and priority flag for fast LCP loading.
      */}
      {animate && !introSkipped && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
          style={{
            maskImage: `url('${INK_MASK_PATH}')`,
            maskSize: "cover",
            maskRepeat: "no-repeat",
            maskType: "alpha",
          }}
        >
          <Image
            src={landscapeImage}
            alt={landscapeAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom brightness-[0.4] pointer-events-none"
          />
        </div>
      )}

      {/* Animated Logo Intro */}
      <motion.div
        key="intro-wrapper"
        className="absolute inset-0 z-20 flex min-h-screen items-center justify-center pointer-events-none"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        {!introSkipped && <AnimationTextHeading autoExit exitDelay={4000} />}
      </motion.div>
    </motion.div>
  );

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-background">
      {/* 1. Background Media & Intro Layer */}
      {mediaElement}

      {/* 2. Top Drop-Down Content Overlay Layer */}
      <motion.div
        className="relative z-30 w-full rounded-b-[2rem]"
        variants={
          animate ? (introSkipped ? containerInstant : container) : undefined
        }
        initial={animate ? "hidden" : false}
        animate={hydrated && animate ? "visible" : undefined}
      >
        <div className="w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]">
          <div
            className={cn(
              "mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
              vs.copy,
              vs.grid,
            )}
          >
            <Reveal
              active={animate}
              className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
            >
              {taglineElement}
            </Reveal>

            <Reveal
              active={animate}
              className={cn(
                "flex flex-col items-start lg:col-span-6 lg:col-start-7",
                vs.header,
              )}
            >
              {titleElement}
              {descriptionElement}
              {ctasElement}
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
