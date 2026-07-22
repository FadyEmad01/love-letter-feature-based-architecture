"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface LogoutButtonProps {
  isLoggingOut: boolean;
  onLogout: () => void;
}

export function LogoutButton({ isLoggingOut, onLogout }: LogoutButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLogout}
      disabled={isLoggingOut}
      className="text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-destructive"
    >
      {isLoggingOut && <Spinner data-icon="inline-start" />}
      {isLoggingOut ? "Logging out..." : "Log Out"}
    </Button>
  );
}
