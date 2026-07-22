"use client";

import { motion } from "motion/react";
import { LogoutButton } from "@/features/dashboard/components/logout-button";
import { UserAvatar } from "@/features/dashboard/components/user-avatar";

interface DashboardHeaderProps {
  userName: string;
  isLoggingOut: boolean;
  onLogout: () => void;
  onAvatarClick: () => void;
}

export function DashboardHeader({
  userName,
  isLoggingOut,
  onLogout,
  onAvatarClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-12">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-2"
        >
          Welcome back
        </motion.p>
        <motion.h1
          key={userName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-advercase tracking-wide text-foreground"
        >
          {userName}
        </motion.h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <LogoutButton isLoggingOut={isLoggingOut} onLogout={onLogout} />
        </div>
        <UserAvatar userName={userName} onClick={onAvatarClick} />
      </div>
    </header>
  );
}
