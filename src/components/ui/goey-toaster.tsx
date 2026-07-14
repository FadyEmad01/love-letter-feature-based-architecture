"use client";

import { GooeyToaster as BaseGooeyToaster } from "goey-toast";

export function GooeyToaster(props: React.ComponentProps<typeof BaseGooeyToaster>) {
  return <BaseGooeyToaster {...props} />;
}