"use client";

import { GooeyToaster as BaseGooeyToaster } from "goey-toast";
import type { ComponentProps } from "react";

export function GooeyToaster(props: ComponentProps<typeof BaseGooeyToaster>) {
  return <BaseGooeyToaster {...props} />;
}
