"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Cta, type CtaProps } from "./cta";
import AnimationTextHeading from "./AnimationTextHeading";

export interface Hero05Props {
  tagline: string;
  title: string;
  description: string;
  landscapeImage: string;
  landscapeAlt?: string;
  animation?: "none" | "subtle";
  primaryCTA?: CtaProps;
  secondaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

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
const container: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0% round 0px 0px 32px 32px)",
    transition: {
      delay: 6, // Wait 6 seconds for the entire ink + logo intro
      staggerChildren: 0.1,
      delayChildren: 6.45, // Correctly synchronized to cascade text after curtain drops
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
    transition: { duration: 1, ease: "easeInOut" },
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
  children: React.ReactNode;
}>) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

export function Hero05({
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
  const [isIntroDone, setIsIntroDone] = React.useState(!animate);

  React.useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      setIsIntroDone(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [animate]);

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

      {/* 
        Ink-Masked Image Layer
        Swapped to next/image using fill layout and priority flag for fast LCP loading.
      */}
      {animate && (
        <div
          className={cn(
            "absolute inset-0 [mask-image:url('/gif/ink.gif')] [mask-size:cover] [mask-repeat:no-repeat] [mask-type:alpha]",
            "transition-opacity duration-1000 ease-in-out pointer-events-none",
          )}
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
        <AnimationTextHeading
          autoExit
          exitDelay={4000}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-background">
      {/* 1. Background Media & Intro Layer */}
      {mediaElement}

      {/* 2. Top Drop-Down Content Overlay Layer */}
      <motion.div
        className="relative z-30 w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]"
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : false}
        animate={animate ? "visible" : undefined}
      >
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
      </motion.div>
    </section>
  );
}