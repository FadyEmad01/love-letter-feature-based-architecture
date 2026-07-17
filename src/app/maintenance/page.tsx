import NoiseOverlay from "@/components/background/NoiseOverlay";

export default function MaintenancePage() {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        {/* biome-ignore lint/performance/noImgElement: simple static asset, no optimization needed */}
        <img src="/svg/logo.svg" alt="Logo" className="h-24 w-auto" />
        <h1 className="text-3xl font-bold font-advercase tracking-wider">
          Under Maintenance
        </h1>
        <p className="text-muted-foreground text-lg">We'll be back soon.</p>
      </div>
      <NoiseOverlay />
    </>
  );
}
