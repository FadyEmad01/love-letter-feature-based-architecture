"use client";
import { Heart, MoreHorizontal } from "lucide-react";

interface DraftItemProps {
  title: string;
  editedAt: string;
}

export function DraftItem({ title, editedAt }: DraftItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-brand-cream flex items-center justify-center">
          <Heart size={16} className="text-brand-brown/50" />
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{editedAt}</p>
        </div>
      </div>
      <MoreHorizontal size={18} className="text-muted-foreground" />
    </div>
  );
}
