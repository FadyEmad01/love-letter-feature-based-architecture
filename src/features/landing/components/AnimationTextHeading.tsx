"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface TextContent {
  scriptTop?: string;
  block1?: string;
  block2?: string;
  scriptBottom?: string;
}

interface AnimationTextHeadingProps {
  text?: TextContent;
  autoExit?: boolean;
  exitDelay?: number;
  staggerDelay?: number;
  startDelay?: number;
  onComplete?: () => void; // <-- Added onComplete prop
}

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
              className="font-great-vibes absolute -left-[15%] -top-[20%] z-20 -rotate-[8deg] text-7xl text-[#F9D5D3] drop-shadow-sm md:-top-[25%] md:text-9xl [-webkit-text-stroke:1px_#42201C] md:[-webkit-text-stroke:2px_#42201C]"
            >
              {text.scriptTop}
            </motion.div>

            <motion.div
              variants={blockTextVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="font-anton relative z-10 text-[5.5rem] uppercase leading-[0.85] tracking-wider text-[#FFF7E4] md:text-[10rem] cursor-default [-webkit-text-stroke:1px_#42201C] md:[-webkit-text-stroke:2px_#42201C] [text-shadow:1px_1px_0_#42201C,2px_2px_0_#42201C,3px_3px_0_#42201C,4px_4px_0_#42201C] md:[text-shadow:1px_1px_0_#42201C,2px_2px_0_#42201C,3px_3px_0_#42201C,4px_4px_0_#42201C,5px_5px_0_#42201C,6px_6px_0_#42201C,7px_7px_0_#42201C,8px_8px_0_#42201C]"
            >
              {text.block1}
            </motion.div>

            <motion.div
              variants={blockTextVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="font-anton relative z-10 -mt-2 text-[6rem] uppercase leading-[0.85] tracking-normal text-[#FFF7E4] md:-mt-4 md:text-[11rem] cursor-default [-webkit-text-stroke:1px_#42201C] md:[-webkit-text-stroke:2px_#42201C] [text-shadow:1px_1px_0_#42201C,2px_2px_0_#42201C,3px_3px_0_#42201C,4px_4px_0_#42201C] md:[text-shadow:1px_1px_0_#42201C,2px_2px_0_#42201C,3px_3px_0_#42201C,4px_4px_0_#42201C,5px_5px_0_#42201C,6px_6px_0_#42201C,7px_7px_0_#42201C,8px_8px_0_#42201C]"
            >
              {text.block2}
            </motion.div>

            <motion.div
              variants={scriptTextVariants}
              className="font-great-vibes absolute -bottom-[35%] left-1/2 z-30 -translate-x-[40%] -rotate-[8deg] text-7xl text-[#F9D5D3] drop-shadow-sm md:-bottom-[45%] md:text-[11rem] [-webkit-text-stroke:1px_#42201C] md:[-webkit-text-stroke:2px_#42201C]"
            >
              {text.scriptBottom}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
