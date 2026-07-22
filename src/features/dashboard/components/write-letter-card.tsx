"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WriteLetterCard() {
  return (
    <Card className="relative overflow-hidden bg-white/40 backdrop-blur-md border-border/50 shadow-sm rounded-[2rem] group hover:shadow-md transition-all cursor-pointer">
      <div className="absolute top-0 right-0 size-32 bg-brand-cream rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-brand-pink/50 transition-colors duration-700" />
      <CardHeader>
        <CardTitle className="font-advercase text-2xl relative z-10">
          Write a Letter
        </CardTitle>
        <CardDescription className="relative z-10">
          Pour your heart out onto a digital canvas. Craft a timeless message
          for the one you love.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="relative z-10 rounded-full">
          <Plus data-icon="inline-start" />
          Start Writing
        </Button>
      </CardFooter>
    </Card>
  );
}
