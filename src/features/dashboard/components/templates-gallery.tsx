"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/features/dashboard/components/template-card";

const mockTemplates = [
  {
    id: 1,
    title: "The First Sight",
    category: "Anniversary",
    color: "bg-[#e2e2d5]",
    price: "Free",
  },
  {
    id: 2,
    title: "Midnight Thoughts",
    category: "Just Because",
    color: "bg-[#d5dce2]",
    price: "Premium",
  },
  {
    id: 3,
    title: "Summer Breeze",
    category: "Birthday",
    color: "bg-[#e2d5d5]",
    price: "Free",
  },
  {
    id: 4,
    title: "Vintage Love",
    category: "Valentine",
    color: "bg-[#e8d5cc]",
    price: "Premium",
  },
];

export function TemplatesGallery() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-advercase text-2xl">Templates Gallery</h3>
        <Button variant="outline" size="icon-sm">
          <Search />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            title={template.title}
            category={template.category}
            color={template.color}
            price={template.price}
          />
        ))}
      </div>
    </div>
  );
}
