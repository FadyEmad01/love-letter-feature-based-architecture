import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/lib/auth";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard — Lovely Letter",
  description: "Your dashboard home.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const cookieStore = await cookies();
  const hasSeenIntro =
    cookieStore.get("dashboard_intro_seen")?.value === session.session.id;

  return (
    <DashboardView
      sessionId={session.session.id}
      userName={session.user.name}
      hasSeenIntro={hasSeenIntro}
    />
  );
}
