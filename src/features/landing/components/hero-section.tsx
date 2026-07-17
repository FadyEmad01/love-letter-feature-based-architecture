// "use client";

// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "motion/react";
// import Image from "next/image";
// import { useCallback, useState } from "react";
// import bgImage from "../assets/images/bg-hero.webp";
// import AnimationTextHeading from "./AnimationTextHeading";
// import { Hero05 } from "./hero-05";

// export default function HeroSection() {
//   const [isIntroDone, setIsIntroDone] = useState(false);

//   const handleIntroComplete = useCallback(() => {
//     setIsIntroDone(true);
//   }, []);

//   return (
//     <main className="relative min-h-screen w-full overflow-x-hidden">
//       {/* Ink-masked background — fades out after intro completes */}
//       <div
//         className={cn(
//           "absolute inset-0 [mask-image:url('/gif/ink.gif')] [mask-size:cover] [mask-repeat:no-repeat] [mask-type:alpha]",
//           "transition-opacity duration-1000 ease-in-out",
//           isIntroDone ? "opacity-0 pointer-events-none" : "opacity-100",
//         )}
//       >
//         <Image
//           src={bgImage}
//           width={736}
//           height={924}
//           alt="bg hero"
//           placeholder="blur"
//           className="absolute inset-0 h-full w-full object-cover object-bottom brightness-[0.6]"
//         />
//       </div>

//       {/* Intro Animation — visible during intro phase only */}
//       <AnimatePresence>
//         {!isIntroDone && (
//           <motion.div
//             key="intro-wrapper"
//             className="relative z-20 flex min-h-screen items-center justify-center"
//             exit={{ opacity: 0, transition: { duration: 0.5 } }}
//           >
//             <AnimationTextHeading
//               autoExit
//               exitDelay={5000}
//               onComplete={handleIntroComplete}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Hero05 — fades in after background has faded out */}
//       <AnimatePresence>
//         {isIntroDone && (
//           <motion.div
//             key="hero05"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
//             className="relative z-10"
//           >
//             <Hero05
//               tagline="A love letter platform"
//               title="Digital letters for your loved ones"
//               description="Create beautiful, interactive open-when letter collections to give to your loved ones. Personalize every word, choose the perfect moment, and let your love speak across time."
//               landscapeImage={bgImage.src}
//               landscapeAlt="Love letter hero background"
//               animation="subtle"
//               variant="standard"
//               primaryCTA={{
//                 ctaEnabled: true,
//                 text: "Explore Now",
//                 link: "/auth/register",
//                 variant: "default",
//                 size: "lg",
//               }}
//               secondaryCTA={{
//                 ctaEnabled: true,
//                 text: "Read Our Story",
//                 link: "/about",
//                 variant: "outline",
//                 size: "lg",
//               }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import bgImage from "../assets/images/bg-hero.webp";
import AnimationTextHeading from "./AnimationTextHeading";
import { Hero05 } from "./hero-05";

export default function HeroSection() {


  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Hero05
        tagline="A love letter platform"
        title="Digital letters for your loved ones"
        description="Create beautiful, interactive open-when letter collections to give to your loved ones. Personalize every word, choose the perfect moment, and let your love speak across time."
        landscapeImage={bgImage.src}
        landscapeAlt="Love letter hero background"
        animation="subtle"
        variant="standard"
        primaryCTA={{
          ctaEnabled: true,
          text: "Explore Now",
          link: "/auth/register",
          variant: "default",
          size: "lg",
        }}
        secondaryCTA={{
          ctaEnabled: true,
          text: "Read Our Story",
          link: "/about",
          variant: "outline",
          size: "lg",
        }}
      />
    </main>
  );
}