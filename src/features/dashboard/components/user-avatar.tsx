"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  userName: string;
  onClick?: () => void;
}

export function UserAvatar({ userName, onClick }: UserAvatarProps) {
  return (
    <Avatar
      size="lg"
      onClick={onClick}
      className="cursor-pointer hover:ring-2 ring-primary/20 transition-all border border-border/50 shadow-sm size-12"
    >
      <AvatarFallback className="bg-brand-pink/30 font-advercase text-xl text-primary">
        {userName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
