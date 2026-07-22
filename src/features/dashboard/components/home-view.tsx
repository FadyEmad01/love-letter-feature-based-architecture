"use client";

import { motion } from "motion/react";
import { RecentDrafts } from "@/features/dashboard/components/recent-drafts";
import { TemplatesGallery } from "@/features/dashboard/components/templates-gallery";
import { WriteLetterCard } from "@/features/dashboard/components/write-letter-card";

export function HomeView() {
  return (
    <motion.div
      key="home-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12"
    >
      <div className="flex flex-col gap-8 lg:col-span-1">
        <WriteLetterCard />
        <RecentDrafts />
      </div>

      <div className="lg:col-span-2">
        <TemplatesGallery />
      </div>
    </motion.div>
  );
}
