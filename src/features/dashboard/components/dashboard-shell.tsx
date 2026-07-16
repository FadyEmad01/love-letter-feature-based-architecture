"use client";

import { SignOutButton } from "@/features/auth/components/sign-out-button";

interface DashboardShellProps {
  userName: string;
  userEmail: string;
}

export function DashboardShell({ userName, userEmail }: DashboardShellProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="mb-2 text-lg">Welcome, {userName}!</p>
        <p className="text-muted-foreground mb-6">{userEmail}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
