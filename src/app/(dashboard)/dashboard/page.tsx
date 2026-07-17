import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/lib/auth";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

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
      userEmail={session.user.email}
      hasSeenIntro={hasSeenIntro}
    />
  );
}
