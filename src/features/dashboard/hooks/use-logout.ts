"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/features/auth/lib/auth-client";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
    } catch {
      // Sign-out failed — proceed to redirect anyway
    } finally {
      router.push("/auth/login");
    }
  };

  return { isLoggingOut, handleLogout };
}
