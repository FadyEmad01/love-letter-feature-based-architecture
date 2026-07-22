import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/features/auth/lib/auth";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { ProfilePage } from "@/features/dashboard/components/profile-page";

export const metadata: Metadata = {
  title: "Profile — Lovely Letter",
  description: "View and edit your profile.",
};

export default async function ProfileRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell userName={session.user.name}>
      <Suspense>
        <ProfilePage
          userName={session.user.name}
          userEmail={session.user.email}
        />
      </Suspense>
    </DashboardShell>
  );
}
