"use client";
import { Badge } from "@/components/ui/badge";

interface TemplateCardProps {
  title: string;
  category: string;
  color: string;
  price: string;
}

export function TemplateCard({
  title,
  category,
  color,
  price,
}: TemplateCardProps) {
  return (
    <div className="group cursor-pointer relative">
      <div
        className={`aspect-[4/5] rounded-[2rem] ${color} p-8 flex flex-col justify-between shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500 overflow-hidden relative border border-black/5`}
      >
        <div className="flex justify-end relative z-10">
          <Badge
            variant="secondary"
            className="bg-white/50 backdrop-blur-md shadow-sm"
          >
            {price}
          </Badge>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-2 opacity-60">
            {category}
          </p>
          <h4 className="font-advercase text-3xl leading-tight">{title}</h4>
        </div>
      </div>
    </div>
  );
}
