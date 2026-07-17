// // // // "use client";

// // // // import { motion, useReducedMotion, type Variants } from "motion/react";
// // // // import type * as React from "react";
// // // // import { cn } from "@/lib/utils";
// // // // import { Cta, type CtaProps } from "./cta";

// // // // export interface Hero05Props {
// // // //   tagline: string;
// // // //   title: string;
// // // //   description: string;
// // // //   landscapeImage: string;
// // // //   landscapeAlt?: string;
// // // //   animation?: "none" | "subtle";
// // // //   primaryCTA?: CtaProps;
// // // //   secondaryCTA?: CtaProps;
// // // //   variant?: "standard" | "compact";
// // // // }

// // // // const variantStyles = {
// // // //   standard: {
// // // //     copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
// // // //     tagline: "text-sm sm:text-base",
// // // //     title: "text-3xl sm:text-4xl md:text-5xl",
// // // //     description: "text-sm sm:text-base",
// // // //     header: "gap-6 sm:gap-8",
// // // //     grid: "gap-10",
// // // //   },
// // // //   compact: {
// // // //     copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
// // // //     tagline: "text-sm",
// // // //     title: "text-2xl sm:text-3xl md:text-4xl",
// // // //     description: "text-sm",
// // // //     header: "gap-4 sm:gap-5",
// // // //     grid: "gap-8",
// // // //   },
// // // // } as const;

// // // // const container: Variants = {
// // // //   hidden: {},
// // // //   visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
// // // // };

// // // // const item: Variants = {
// // // //   hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
// // // //   visible: {
// // // //     opacity: 1,
// // // //     y: 0,
// // // //     filter: "blur(0px)",
// // // //     transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
// // // //   },
// // // // };

// // // // const mediaItem: Variants = {
// // // //   hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
// // // //   visible: {
// // // //     opacity: 1,
// // // //     y: 0,
// // // //     filter: "blur(0px)",
// // // //     transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
// // // //   },
// // // // };

// // // // function Reveal({
// // // //   active,
// // // //   variants,
// // // //   className,
// // // //   children,
// // // // }: Readonly<{
// // // //   active: boolean;
// // // //   variants?: Variants;
// // // //   className?: string;
// // // //   children: React.ReactNode;
// // // // }>) {
// // // //   if (!active) return <div className={className}>{children}</div>;

// // // //   return (
// // // //     <motion.div variants={variants ?? item} className={className}>
// // // //       {children}
// // // //     </motion.div>
// // // //   );
// // // // }

// // // // export function Hero05({
// // // //   tagline,
// // // //   title,
// // // //   description,
// // // //   landscapeImage,
// // // //   landscapeAlt = "",
// // // //   animation = "none",
// // // //   primaryCTA,
// // // //   secondaryCTA,
// // // //   variant = "standard",
// // // // }: Readonly<Hero05Props>) {
// // // //   const reduce = useReducedMotion();
// // // //   const animate = animation === "subtle" && !reduce;
// // // //   const vs = variantStyles[variant];

// // // //   const taglineElement = tagline && (
// // // //     <p
// // // //       className={cn(
// // // //         "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
// // // //         vs.tagline,
// // // //       )}
// // // //     >
// // // //       {tagline}
// // // //     </p>
// // // //   );

// // // //   const titleElement = title && (
// // // //     <h1
// // // //       className={cn(
// // // //         "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
// // // //         vs.title,
// // // //       )}
// // // //     >
// // // //       {title}
// // // //     </h1>
// // // //   );

// // // //   const descriptionElement = description && (
// // // //     <p
// // // //       className={cn(
// // // //         "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
// // // //         vs.description,
// // // //       )}
// // // //     >
// // // //       {description}
// // // //     </p>
// // // //   );

// // // //   const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
// // // //     <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
// // // //       {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
// // // //       {secondaryCTA?.ctaEnabled && (
// // // //         <Cta
// // // //           cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   const mediaElement = landscapeImage && (
// // // //     <div className="relative w-full overflow-hidden">
// // // //       <div
// // // //         className={cn(
// // // //           "relative overflow-hidden [border-radius:0_0_0.25rem_0.25rem]",
// // // //         )}
// // // //       >
// // // //         <div
// // // //           aria-hidden
// // // //           className="bg-background/15 dark:bg-background/30 pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
// // // //         />
// // // //         {/* biome-ignore lint/performance/noImgElement: Dynamic src from props, not a static import */}
// // // //         <img
// // // //           src={landscapeImage}
// // // //           alt={landscapeAlt}
// // // //           decoding="async"
// // // //           className="aspect-[2/1] w-full object-cover object-center outline outline-black/10 sm:aspect-[9/4] dark:outline-white/10 dark:brightness-[0.97] dark:saturate-[0.92]"
// // // //         />
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <section className="bg-background relative isolate w-full overflow-hidden">
// // // //       <motion.div
// // // //         className={cn(
// // // //           "relative z-10 mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
// // // //           vs.copy,
// // // //           vs.grid,
// // // //         )}
// // // //         variants={animate ? container : undefined}
// // // //         initial={animate ? "hidden" : false}
// // // //         whileInView={animate ? "visible" : undefined}
// // // //         viewport={{ once: true, margin: "-80px" }}
// // // //       >
// // // //         <Reveal
// // // //           active={animate}
// // // //           className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
// // // //         >
// // // //           {taglineElement}
// // // //         </Reveal>

// // // //         <Reveal
// // // //           active={animate}
// // // //           className={cn(
// // // //             "flex flex-col items-start lg:col-span-6 lg:col-start-7",
// // // //             vs.header,
// // // //           )}
// // // //         >
// // // //           {titleElement}
// // // //           {descriptionElement}
// // // //           {ctasElement}
// // // //         </Reveal>
// // // //       </motion.div>

// // // //       <Reveal active={animate} variants={mediaItem} className="w-full">
// // // //         {mediaElement}
// // // //       </Reveal>
// // // //     </section>
// // // //   );
// // // // }

// // // "use client";

// // // import { motion, useReducedMotion, type Variants } from "motion/react";
// // // import type * as React from "react";
// // // import { cn } from "@/lib/utils";
// // // import { Cta, type CtaProps } from "./cta";

// // // export interface Hero05Props {
// // //   tagline: string;
// // //   title: string;
// // //   description: string;
// // //   landscapeImage: string;
// // //   landscapeAlt?: string;
// // //   animation?: "none" | "subtle";
// // //   primaryCTA?: CtaProps;
// // //   secondaryCTA?: CtaProps;
// // //   variant?: "standard" | "compact";
// // // }

// // // const variantStyles = {
// // //   standard: {
// // //     copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
// // //     tagline: "text-sm sm:text-base",
// // //     title: "text-3xl sm:text-4xl md:text-5xl",
// // //     description: "text-sm sm:text-base",
// // //     header: "gap-6 sm:gap-8",
// // //     grid: "gap-10",
// // //   },
// // //   compact: {
// // //     copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
// // //     tagline: "text-sm",
// // //     title: "text-2xl sm:text-3xl md:text-4xl",
// // //     description: "text-sm",
// // //     header: "gap-4 sm:gap-5",
// // //     grid: "gap-8",
// // //   },
// // // } as const;

// // // // The text overlay container starts shifted up (-15%) and slides down to 0
// // // const container: Variants = {
// // //   hidden: { opacity: 0, y: "-15%" },
// // //   visible: {
// // //     opacity: 1,
// // //     y: "0%",
// // //     transition: {
// // //       staggerChildren: 0.1,
// // //       delayChildren: 0.1,
// // //       duration: 0.7,
// // //       ease: [0.22, 1, 0.36, 1],
// // //     },
// // //   },
// // // };

// // // // Individual text items also slide down slightly for a cascading effect
// // // const item: Variants = {
// // //   hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
// // //   visible: {
// // //     opacity: 1,
// // //     y: 0,
// // //     filter: "blur(0px)",
// // //     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
// // //   },
// // // };

// // // // A simple fade-in for the background image so it doesn't pop in harshly
// // // const bgImageVariant: Variants = {
// // //   hidden: { opacity: 0 },
// // //   visible: {
// // //     opacity: 1,
// // //     transition: { duration: 1, ease: "easeInOut" },
// // //   },
// // // };

// // // function Reveal({
// // //   active,
// // //   variants,
// // //   className,
// // //   children,
// // // }: Readonly<{
// // //   active: boolean;
// // //   variants?: Variants;
// // //   className?: string;
// // //   children: React.ReactNode;
// // // }>) {
// // //   if (!active) return <div className={className}>{children}</div>;

// // //   return (
// // //     <motion.div variants={variants ?? item} className={className}>
// // //       {children}
// // //     </motion.div>
// // //   );
// // // }

// // // export function Hero05({
// // //   tagline,
// // //   title,
// // //   description,
// // //   landscapeImage,
// // //   landscapeAlt = "",
// // //   animation = "none",
// // //   primaryCTA,
// // //   secondaryCTA,
// // //   variant = "standard",
// // // }: Readonly<Hero05Props>) {
// // //   const reduce = useReducedMotion();
// // //   const animate = animation === "subtle" && !reduce;
// // //   const vs = variantStyles[variant];

// // //   const taglineElement = tagline && (
// // //     <p
// // //       className={cn(
// // //         "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
// // //         vs.tagline,
// // //       )}
// // //     >
// // //       {tagline}
// // //     </p>
// // //   );

// // //   const titleElement = title && (
// // //     <h1
// // //       className={cn(
// // //         "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
// // //         vs.title,
// // //       )}
// // //     >
// // //       {title}
// // //     </h1>
// // //   );

// // //   const descriptionElement = description && (
// // //     <p
// // //       className={cn(
// // //         "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
// // //         vs.description,
// // //       )}
// // //     >
// // //       {description}
// // //     </p>
// // //   );

// // //   const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
// // //     <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
// // //       {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
// // //       {secondaryCTA?.ctaEnabled && (
// // //         <Cta
// // //           cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
// // //         />
// // //       )}
// // //     </div>
// // //   );

// // //   const mediaElement = landscapeImage && (
// // //     <motion.div 
// // //       className="absolute inset-0 z-0 h-screen w-full overflow-hidden"
// // //       variants={animate ? bgImageVariant : undefined}
// // //       initial={animate ? "hidden" : false}
// // //       animate={animate ? "visible" : undefined}
// // //     >
// // //       <div
// // //         aria-hidden
// // //         className="absolute inset-0 z-10 bg-black/40 pointer-events-none mix-blend-multiply"
// // //       />
// // //       {/* biome-ignore lint/performance/noImgElement: Dynamic src from props, not a static import */}
// // //       <img
// // //         src={landscapeImage}
// // //         alt={landscapeAlt}
// // //         decoding="async"
// // //         className="h-full w-full object-cover object-center dark:brightness-[0.97] dark:saturate-[0.92]"
// // //       />
// // //     </motion.div>
// // //   );

// // //   return (
// // //     <section className="relative isolate min-h-screen w-full overflow-hidden bg-black">
// // //       {/* 1. Background Layer (z-0) */}
// // //       {mediaElement}

// // //       {/* 2. Content Overlay Layer (z-10) 
// // //           Now split into a FULL-WIDTH motion container with bg-background 
// // //           and an INNER grid container for the max-w-7xl layout */}
// // //       <motion.div
// // //         className="relative z-10 w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]" // <-- Added optional blur and rounded bottom for a nice overlay aesthetic
// // //         variants={animate ? container : undefined}
// // //         initial={animate ? "hidden" : false}
// // //         whileInView={animate ? "visible" : undefined}
// // //         viewport={{ once: true, margin: "-80px" }}
// // //       >
// // //         <div
// // //           className={cn(
// // //             "mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
// // //             vs.copy,
// // //             vs.grid,
// // //           )}
// // //         >
// // //           <Reveal
// // //             active={animate}
// // //             className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
// // //           >
// // //             {taglineElement}
// // //           </Reveal>

// // //           <Reveal
// // //             active={animate}
// // //             className={cn(
// // //               "flex flex-col items-start lg:col-span-6 lg:col-start-7",
// // //               vs.header,
// // //             )}
// // //           >
// // //             {titleElement}
// // //             {descriptionElement}
// // //             {ctasElement}
// // //           </Reveal>
// // //         </div>
// // //       </motion.div>
// // //     </section>
// // //   );
// // // }

// // "use client";

// // import { motion, useReducedMotion, type Variants } from "motion/react";
// // import type * as React from "react";
// // import { cn } from "@/lib/utils";
// // import { Cta, type CtaProps } from "./cta";

// // export interface Hero05Props {
// //   tagline: string;
// //   title: string;
// //   description: string;
// //   landscapeImage: string;
// //   landscapeAlt?: string;
// //   animation?: "none" | "subtle";
// //   primaryCTA?: CtaProps;
// //   secondaryCTA?: CtaProps;
// //   variant?: "standard" | "compact";
// // }

// // const variantStyles = {
// //   standard: {
// //     copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
// //     tagline: "text-sm sm:text-base",
// //     title: "text-3xl sm:text-4xl md:text-5xl",
// //     description: "text-sm sm:text-base",
// //     header: "gap-6 sm:gap-8",
// //     grid: "gap-10",
// //   },
// //   compact: {
// //     copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
// //     tagline: "text-sm",
// //     title: "text-2xl sm:text-3xl md:text-4xl",
// //     description: "text-sm",
// //     header: "gap-4 sm:gap-5",
// //     grid: "gap-8",
// //   },
// // } as const;

// // // UPDATED: A pure top-to-bottom wipe (curtain reveal) with no scaling or sliding.
// // // Starts with the bottom clipped 100% of the way up, and animates down to 0%.
// // const container: Variants = {
// //   hidden: { 
// //     opacity: 0,
// //     clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)"
// //   },
// //   visible: {
// //     opacity: 1,
// //     clipPath: "inset(0% 0% 0% 0% round 0px 0px 32px 32px)", 
// //     transition: {
// //       staggerChildren: 0.1,
// //       delayChildren: 0.15,
// //       duration: 0.8,
// //       ease: [0.22, 1, 0.36, 1],
// //     },
// //   },
// // };

// // // Individual text items also slide down slightly for a cascading effect
// // const item: Variants = {
// //   hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
// //   visible: {
// //     opacity: 1,
// //     y: 0,
// //     filter: "blur(0px)",
// //     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
// //   },
// // };

// // // A simple fade-in for the background image so it doesn't pop in harshly
// // const bgImageVariant: Variants = {
// //   hidden: { opacity: 0 },
// //   visible: {
// //     opacity: 1,
// //     transition: { duration: 1, ease: "easeInOut" },
// //   },
// // };

// // function Reveal({
// //   active,
// //   variants,
// //   className,
// //   children,
// // }: Readonly<{
// //   active: boolean;
// //   variants?: Variants;
// //   className?: string;
// //   children: React.ReactNode;
// // }>) {
// //   if (!active) return <div className={className}>{children}</div>;

// //   return (
// //     <motion.div variants={variants ?? item} className={className}>
// //       {children}
// //     </motion.div>
// //   );
// // }

// // export function Hero05({
// //   tagline,
// //   title,
// //   description,
// //   landscapeImage,
// //   landscapeAlt = "",
// //   animation = "none",
// //   primaryCTA,
// //   secondaryCTA,
// //   variant = "standard",
// // }: Readonly<Hero05Props>) {
// //   const reduce = useReducedMotion();
// //   const animate = animation === "subtle" && !reduce;
// //   const vs = variantStyles[variant];

// //   const taglineElement = tagline && (
// //     <p
// //       className={cn(
// //         "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
// //         vs.tagline,
// //       )}
// //     >
// //       {tagline}
// //     </p>
// //   );

// //   const titleElement = title && (
// //     <h1
// //       className={cn(
// //         "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
// //         vs.title,
// //       )}
// //     >
// //       {title}
// //     </h1>
// //   );

// //   const descriptionElement = description && (
// //     <p
// //       className={cn(
// //         "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
// //         vs.description,
// //       )}
// //     >
// //       {description}
// //     </p>
// //   );

// //   const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
// //     <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
// //       {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
// //       {secondaryCTA?.ctaEnabled && (
// //         <Cta
// //           cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
// //         />
// //       )}
// //     </div>
// //   );

// //   const mediaElement = landscapeImage && (
// //     <motion.div 
// //       className="absolute inset-0 z-0 h-screen w-full overflow-hidden"
// //       variants={animate ? bgImageVariant : undefined}
// //       initial={animate ? "hidden" : false}
// //       animate={animate ? "visible" : undefined}
// //     >
// //       <div
// //         aria-hidden
// //         className="absolute inset-0 z-10 bg-black/40 pointer-events-none mix-blend-multiply"
// //       />
// //       {/* biome-ignore lint/performance/noImgElement: Dynamic src from props, not a static import */}
// //       <img
// //         src={landscapeImage}
// //         alt={landscapeAlt}
// //         decoding="async"
// //         className="h-full w-full object-cover object-center dark:brightness-[0.97] dark:saturate-[0.92]"
// //       />
// //     </motion.div>
// //   );

// //   return (
// //     <section className="relative isolate min-h-screen w-full overflow-hidden bg-black">
// //       {/* 1. Background Layer (z-0) */}
// //       {mediaElement}

// //       {/* 2. Content Overlay Layer (z-10) */}
// //       <motion.div
// //         className="relative z-10 w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]"
// //         variants={animate ? container : undefined}
// //         initial={animate ? "hidden" : false}
// //         whileInView={animate ? "visible" : undefined}
// //         viewport={{ once: true, margin: "-80px" }}
// //       >
// //         <div
// //           className={cn(
// //             "mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
// //             vs.copy,
// //             vs.grid,
// //           )}
// //         >
// //           <Reveal
// //             active={animate}
// //             className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
// //           >
// //             {taglineElement}
// //           </Reveal>

// //           <Reveal
// //             active={animate}
// //             className={cn(
// //               "flex flex-col items-start lg:col-span-6 lg:col-start-7",
// //               vs.header,
// //             )}
// //           >
// //             {titleElement}
// //             {descriptionElement}
// //             {ctasElement}
// //           </Reveal>
// //         </div>
// //       </motion.div>
// //     </section>
// //   );
// // }

// "use client";

// import { motion, useReducedMotion, type Variants } from "motion/react";
// import type * as React from "react";
// import { cn } from "@/lib/utils";
// import { Cta, type CtaProps } from "./cta";

// export interface Hero05Props {
//   tagline: string;
//   title: string;
//   description: string;
//   landscapeImage: string;
//   landscapeAlt?: string;
//   animation?: "none" | "subtle";
//   primaryCTA?: CtaProps;
//   secondaryCTA?: CtaProps;
//   variant?: "standard" | "compact";
// }

// const variantStyles = {
//   standard: {
//     copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
//     tagline: "text-sm sm:text-base",
//     title: "text-3xl sm:text-4xl md:text-5xl",
//     description: "text-sm sm:text-base",
//     header: "gap-6 sm:gap-8",
//     grid: "gap-10",
//   },
//   compact: {
//     copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
//     tagline: "text-sm",
//     title: "text-2xl sm:text-3xl md:text-4xl",
//     description: "text-sm",
//     header: "gap-4 sm:gap-5",
//     grid: "gap-8",
//   },
// } as const;

// // Pure top-to-bottom wipe (curtain reveal) with no scaling or sliding.
// const container: Variants = {
//   hidden: { 
//     opacity: 0,
//     clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)"
//   },
//   visible: {
//     opacity: 1,
//     clipPath: "inset(0% 0% 0% 0% round 0px 0px 32px 32px)", 
//     transition: {
//       delay: 5,
//       staggerChildren: 0.1,
//       delayChildren: 0.15,
//       duration: 0.8,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   },
// };

// const item: Variants = {
//   hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
//   visible: {
//     opacity: 1,
//     y: 0,
//     filter: "blur(0px)",
//     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// const bgImageVariant: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { duration: 1, ease: "easeInOut" },
//   },
// };

// function Reveal({
//   active,
//   variants,
//   className,
//   children,
// }: Readonly<{
//   active: boolean;
//   variants?: Variants;
//   className?: string;
//   children: React.ReactNode;
// }>) {
//   if (!active) return <div className={className}>{children}</div>;

//   return (
//     <motion.div variants={variants ?? item} className={className}>
//       {children}
//     </motion.div>
//   );
// }

// export function Hero05({
//   tagline,
//   title,
//   description,
//   landscapeImage,
//   landscapeAlt = "",
//   animation = "none",
//   primaryCTA,
//   secondaryCTA,
//   variant = "standard",
// }: Readonly<Hero05Props>) {
//   const reduce = useReducedMotion();
//   const animate = animation === "subtle" && !reduce;
//   const vs = variantStyles[variant];

//   const taglineElement = tagline && (
//     <p
//       className={cn(
//         "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
//         vs.tagline,
//       )}
//     >
//       {tagline}
//     </p>
//   );

//   const titleElement = title && (
//     <h1
//       className={cn(
//         "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
//         vs.title,
//       )}
//     >
//       {title}
//     </h1>
//   );

//   const descriptionElement = description && (
//     <p
//       className={cn(
//         "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
//         vs.description,
//       )}
//     >
//       {description}
//     </p>
//   );

//   const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
//     <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
//       {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
//       {secondaryCTA?.ctaEnabled && (
//         <Cta
//           cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
//         />
//       )}
//     </div>
//   );

//   const mediaElement = landscapeImage && (
//     <motion.div 
//       className="absolute inset-0 z-0 h-screen w-full overflow-hidden"
//       variants={animate ? bgImageVariant : undefined}
//       initial={animate ? "hidden" : false}
//       animate={animate ? "visible" : undefined}
//     >
//       <div
//         aria-hidden
//         className="absolute inset-0 z-10 bg-black/40 pointer-events-none mix-blend-multiply"
//       />
//       {/* biome-ignore lint/performance/noImgElement: Dynamic src from props, not a static import */}
//       <img
//         src={landscapeImage}
//         alt={landscapeAlt}
//         decoding="async"
//         className="h-full w-full object-cover object-bottom brightness-70"
//       />
//     </motion.div>
//   );

//   return (
//     <section className="relative isolate min-h-screen w-full overflow-hidden bg-black">
//       {/* 1. Background Layer (z-0) */}
//       {mediaElement}

//       {/* 2. Content Overlay Layer (z-10) */}
//       <motion.div
//         className="relative z-10 w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]"
//         variants={animate ? container : undefined}
//         initial={animate ? "hidden" : false}
//         // CHANGED: Use animate instead of whileInView so it triggers immediately on load
//         animate={animate ? "visible" : undefined} 
//       >
//         <div
//           className={cn(
//             "mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
//             vs.copy,
//             vs.grid,
//           )}
//         >
//           <Reveal
//             active={animate}
//             className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
//           >
//             {taglineElement}
//           </Reveal>

//           <Reveal
//             active={animate}
//             className={cn(
//               "flex flex-col items-start lg:col-span-6 lg:col-start-7",
//               vs.header,
//             )}
//           >
//             {titleElement}
//             {descriptionElement}
//             {ctasElement}
//           </Reveal>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

////////////////////////////////////////////////////

// "use client";

// import { motion, useReducedMotion, type Variants } from "motion/react";
// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { Cta, type CtaProps } from "./cta";
// import AnimationTextHeading from "./AnimationTextHeading";

// export interface Hero05Props {
//   tagline: string;
//   title: string;
//   description: string;
//   landscapeImage: string;
//   landscapeAlt?: string;
//   animation?: "none" | "subtle";
//   primaryCTA?: CtaProps;
//   secondaryCTA?: CtaProps;
//   variant?: "standard" | "compact";
// }

// const variantStyles = {
//   standard: {
//     copy: "pt-20 pb-10 sm:pt-28 sm:pb-12 lg:pt-32",
//     tagline: "text-sm sm:text-base",
//     title: "text-3xl sm:text-4xl md:text-5xl",
//     description: "text-sm sm:text-base",
//     header: "gap-6 sm:gap-8",
//     grid: "gap-10",
//   },
//   compact: {
//     copy: "pt-14 pb-8 sm:pt-20 sm:pb-10 lg:pt-24",
//     tagline: "text-sm",
//     title: "text-2xl sm:text-3xl md:text-4xl",
//     description: "text-sm",
//     header: "gap-4 sm:gap-5",
//     grid: "gap-8",
//   },
// } as const;

// const container: Variants = {
//   hidden: {
//     opacity: 0,
//     clipPath: "inset(0% 0% 100% 0% round 0px 0px 32px 32px)"
//   },
//   visible: {
//     opacity: 1,
//     clipPath: "inset(0% 0% 0% 0% round 0px 0px 32px 32px)",
//     transition: {
//       delay: 5, // Wait 5 seconds for the ink intro
//       staggerChildren: 0.1,
//       // In Framer Motion, delayChildren must account for the parent's delay manually
//       delayChildren: 5.15,
//       duration: 0.8,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   },
// };

// const item: Variants = {
//   hidden: { opacity: 0, y: -20, filter: "blur(6px)" },
//   visible: {
//     opacity: 1,
//     y: 0,
//     filter: "blur(0px)",
//     transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// const bgImageVariant: Variants = {
//   hidden: { opacity: 1 },
//   visible: {
//     opacity: 1,
//     transition: { duration: 1, ease: "easeInOut" },
//   },
// };

// function Reveal({
//   active,
//   variants,
//   className,
//   children,
// }: Readonly<{
//   active: boolean;
//   variants?: Variants;
//   className?: string;
//   children: React.ReactNode;
// }>) {
//   if (!active) return <div className={className}>{children}</div>;

//   return (
//     <motion.div variants={variants ?? item} className={className}>
//       {children}
//     </motion.div>
//   );
// }

// export function Hero05({
//   tagline,
//   title,
//   description,
//   landscapeImage,
//   landscapeAlt = "",
//   animation = "none",
//   primaryCTA,
//   secondaryCTA,
//   variant = "standard",
// }: Readonly<Hero05Props>) {
//   const reduce = useReducedMotion();
//   const animate = animation === "subtle" && !reduce;
//   const vs = variantStyles[variant];

//   // State to track when the ink animation finishes
//   const [isIntroDone, setIsIntroDone] = React.useState(!animate);

//   React.useEffect(() => {
//     if (!animate) return;

//     // Trigger the cross-fade at 4.5s so it smoothly completes 
//     // right as the overlay drops down at 5.0s
//     const timer = setTimeout(() => {
//       setIsIntroDone(true);
//     }, 4500);

//     return () => clearTimeout(timer);
//   }, [animate]);

//   const taglineElement = tagline && (
//     <p
//       className={cn(
//         "text-muted-foreground max-w-xs leading-relaxed tracking-tight text-wrap-balance",
//         vs.tagline,
//       )}
//     >
//       {tagline}
//     </p>
//   );

//   const titleElement = title && (
//     <h1
//       className={cn(
//         "text-foreground font-advercase font-normal tracking-wide text-wrap-balance",
//         vs.title,
//       )}
//     >
//       {title}
//     </h1>
//   );

//   const descriptionElement = description && (
//     <p
//       className={cn(
//         "text-muted-foreground max-w-xl leading-relaxed text-wrap-balance",
//         vs.description,
//       )}
//     >
//       {description}
//     </p>
//   );

//   const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
//     <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
//       {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
//       {secondaryCTA?.ctaEnabled && (
//         <Cta
//           cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }}
//         />
//       )}
//     </div>
//   );

//   const mediaElement = landscapeImage && (
//     <motion.div
//       className="absolute inset-0 z-0 h-screen w-full overflow-hidden bg-black"
//       variants={animate ? bgImageVariant : undefined}
//       initial={animate ? "hidden" : false}
//       animate={animate ? "visible" : undefined}
//     >
//       <div
//         aria-hidden
//         className="absolute z-10 inset-0 pointer-events-none mix-blend-multiply"
//       />
//       <div className="absolute inset-0 bg-background" />

//       <motion.div
//         key="intro-wrapper"
//         className="relative z-20 flex min-h-screen items-center justify-center"
//         exit={{ opacity: 0, transition: { duration: 0.5 } }}
//       >
//         <AnimationTextHeading
//           autoExit
//           exitDelay={4000}
//         // onComplete={handleIntroComplete}
//         />
//       </motion.div>

//       {/* Layer 2: Ink-masked Image 
//           Handles the initial reveal via GIF, then fades out */}
//       {animate && (
//         <div
//           className={cn(
//             "absolute inset-0 [mask-image:url('/gif/ink.gif')] [mask-size:cover] [mask-repeat:no-repeat] [mask-type:alpha]",
//             "transition-opacity ease-in-out pointer-events-none",
//             // isIntroDone ? "opacity-0 " : "opacity-100",
//           )}
//         >
//           <img
//             src={landscapeImage}
//             alt=""
//             decoding="async"
//             className="h-full w-full object-cover object-bottom brightness-40 pointer-events-none"
//           />
//         </div>
//       )}
//     </motion.div>
//   );

//   return (
//     <section className="relative isolate min-h-screen w-full overflow-hidden bg-black">
//       {/* 1. Background Layer (z-0) */}
//       {mediaElement}

//       {/* 2. Content Overlay Layer (z-10) */}
//       <motion.div
//         className="relative z-10 w-full bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[2rem]"
//         variants={animate ? container : undefined}
//         initial={animate ? "hidden" : false}
//         animate={animate ? "visible" : undefined}
//       >
//         <div
//           className={cn(
//             "mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12",
//             vs.copy,
//             vs.grid,
//           )}
//         >
//           <Reveal
//             active={animate}
//             className="flex lg:col-span-4 lg:col-start-1 lg:items-end lg:self-stretch"
//           >
//             {taglineElement}
//           </Reveal>

//           <Reveal
//             active={animate}
//             className={cn(
//               "flex flex-col items-start lg:col-span-6 lg:col-start-7",
//               vs.header,
//             )}
//           >
//             {titleElement}
//             {descriptionElement}
//             {ctasElement}
//           </Reveal>
//         </div>
//       </motion.div>
//     </section>
//   );
// }