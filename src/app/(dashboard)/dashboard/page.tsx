import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-2">Welcome, {session.user.name}!</p>
        <p className="text-muted-foreground mb-6">{session.user.email}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
