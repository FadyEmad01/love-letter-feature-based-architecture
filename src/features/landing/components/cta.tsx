import { cva } from "class-variance-authority";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CtaProps } from "../types";

const ctaVariants = cva("w-fit rounded-full px-4", {
  variants: {
    invert: {
      true: "bg-white! text-zinc-900! border-transparent! hover:bg-zinc-100!",
      false: "",
    },
  },
  defaultVariants: {
    invert: false,
  },
});

export function Cta({
  cta,
  className,
  invert,
}: Readonly<{ cta?: CtaProps; className?: string; invert?: boolean }>) {
  if (!cta?.ctaEnabled) return null;

  const variant = cta.variant ?? (invert ? "secondary" : "default");

  if (!cta.link) {
    return (
      <Button
        className={cn(ctaVariants({ invert }), className)}
        variant={variant}
        size={cta.size ?? "default"}
        aria-label={cta.text}
        type="button"
      >
        {cta.text}
      </Button>
    );
  }

  return (
    <Link
      href={cta.link}
      className={cn(
        buttonVariants({
          variant,
          size: cta.size ?? "default",
          className: cn(ctaVariants({ invert }), className),
        }),
      )}
    >
      {cta.text}
    </Link>
  );
}
