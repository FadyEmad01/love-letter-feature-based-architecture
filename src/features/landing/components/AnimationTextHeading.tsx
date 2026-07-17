"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AnimationTextHeadingProps, TextContent } from "../types";

const defaultText: TextContent = {
  scriptTop: "The",
  block1: "TRUE",
  block2: "HEART",
  scriptBottom: "Written",
};

export default function AnimationTextHeading({
  text = defaultText,
  autoExit = false,
  exitDelay = 5000,
  staggerDelay = 0.25,
  startDelay = 0.4,
  onComplete, // <-- Destructure it here
}: AnimationTextHeadingProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoExit) return;
    const timer = setTimeout(() => setVisible(false), exitDelay);
    return () => clearTimeout(timer);
  }, [autoExit, exitDelay]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: startDelay },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0 },
    },
  };

  const blockTextVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 40, damping: 15 },
    },
    exit: {
      opacity: 0,
      y: -40,
      filter: "blur(12px)",
      transition: { duration: 0.3 },
    },
  };

  const scriptTextVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 30, damping: 15 },
    },
    exit: {
      opacity: 0,
      y: -40,
      filter: "blur(12px)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div>
      {/* Trigger onComplete when the exit animation fully finishes */}
      <AnimatePresence onExitComplete={() => onComplete?.()}>
        {visible && (
          <motion.div
            key="heading"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative flex flex-col items-center"
          >
            <motion.div
              variants={scriptTextVariants}
              className="font-great-vibes absolute -left-[15%] -top-[20%] z-20 -rotate-[8deg] text-7xl text-brand-pink drop-shadow-sm md:-top-[25%] md:text-9xl [-webkit-text-stroke:1px_var(--brand-brown)] md:[-webkit-text-stroke:2px_var(--brand-brown)]"
            >
              {text.scriptTop}
            </motion.div>

            <motion.div
              variants={blockTextVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="font-anton relative z-10 text-[5.5rem] uppercase leading-[0.85] tracking-wider text-brand-cream md:text-[10rem] cursor-default [-webkit-text-stroke:1px_var(--brand-brown)] md:[-webkit-text-stroke:2px_var(--brand-brown)]"
              style={{
                textShadow:
                  "1px 1px 0 var(--brand-brown), 2px 2px 0 var(--brand-brown), 3px 3px 0 var(--brand-brown), 4px 4px 0 var(--brand-brown), 5px 5px 0 var(--brand-brown), 6px 6px 0 var(--brand-brown), 7px 7px 0 var(--brand-brown), 8px 8px 0 var(--brand-brown)",
              }}
            >
              {text.block1}
            </motion.div>

            <motion.div
              variants={blockTextVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="font-anton relative z-10 -mt-2 text-[6rem] uppercase leading-[0.85] tracking-normal text-brand-cream md:-mt-4 md:text-[11rem] cursor-default [-webkit-text-stroke:1px_var(--brand-brown)] md:[-webkit-text-stroke:2px_var(--brand-brown)]"
              style={{
                textShadow:
                  "1px 1px 0 var(--brand-brown), 2px 2px 0 var(--brand-brown), 3px 3px 0 var(--brand-brown), 4px 4px 0 var(--brand-brown), 5px 5px 0 var(--brand-brown), 6px 6px 0 var(--brand-brown), 7px 7px 0 var(--brand-brown), 8px 8px 0 var(--brand-brown)",
              }}
            >
              {text.block2}
            </motion.div>

            <motion.div
              variants={scriptTextVariants}
              className="font-great-vibes absolute -bottom-[35%] left-1/2 z-30 -translate-x-[40%] -rotate-[8deg] text-7xl text-brand-pink drop-shadow-sm md:-bottom-[45%] md:text-[11rem] [-webkit-text-stroke:1px_var(--brand-brown)] md:[-webkit-text-stroke:2px_var(--brand-brown)]"
            >
              {text.scriptBottom}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
