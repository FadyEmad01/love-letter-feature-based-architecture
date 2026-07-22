"use client";

import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/features/dashboard/components/profile-form";

interface ProfileViewProps {
  userName: string;
  editName: string;
  onEditNameChange: (value: string) => void;
  userEmail: string;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileView({
  userName,
  editName,
  onEditNameChange,
  userEmail,
  isUpdating,
  onSubmit,
}: ProfileViewProps) {
  return (
    <motion.div
      key="profile-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl"
    >
      <Card className="relative overflow-hidden bg-white/40 backdrop-blur-md border-border/50 shadow-sm rounded-[2rem]">
        <div className="absolute top-0 right-0 size-64 bg-brand-cream/50 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />
        <CardHeader>
          <CardTitle className="font-advercase text-3xl">
            Your Profile
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ProfileForm
            editName={editName}
            onEditNameChange={onEditNameChange}
            userName={userName}
            userEmail={userEmail}
            isUpdating={isUpdating}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
