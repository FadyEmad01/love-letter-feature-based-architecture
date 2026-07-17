type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export interface CtaProps {
  ctaEnabled?: boolean;
  text: string;
  link: string;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg";
}

export interface Hero05Props {
  tagline: string;
  title: string;
  description: string;
  landscapeImage: string;
  landscapeAlt?: string;
  animation?: "none" | "subtle";
  primaryCTA?: CtaProps;
  secondaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

export interface TextContent {
  scriptTop?: string;
  block1?: string;
  block2?: string;
  scriptBottom?: string;
}

export interface AnimationTextHeadingProps {
  text?: TextContent;
  autoExit?: boolean;
  exitDelay?: number;
  staggerDelay?: number;
  startDelay?: number;
  onComplete?: () => void;
}
