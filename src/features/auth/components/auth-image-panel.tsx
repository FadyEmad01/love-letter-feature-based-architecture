import Image from "next/image";
import bgImage from "@/assets/images/bg-hero.webp";

export function AuthImagePanel() {
  return (
    <div className="relative hidden bg-muted lg:flex min-h-svh items-center justify-center">
      <Image
        src={bgImage.src}
        alt="Background"
        fill
        sizes="50vw"
        placeholder="blur"
        blurDataURL={bgImage.blurDataURL}
        className="object-cover brightness-[0.6]"
      />
      {/* biome-ignore lint/performance/noImgElement: SVGs need <img> to avoid next/image rasterization */}
      <img
        src="/svg/logo.svg"
        alt="Logo"
        className="relative z-10 h-80 w-auto"
      />
    </div>
  );
}
