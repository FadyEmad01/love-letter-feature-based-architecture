export default function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full overflow-hidden">
      <div
        // 1. Reduced footprint to 150% (saves memory/GPU)
        // 2. Added opacity and a blend mode so it feels like a texture, not a curtain
        className="absolute -left-[25%] -top-[25%] h-[150%] w-[150%] animate-noise mix-blend-overlay"
        style={{
          backgroundImage: 'url("/texture/noise.webp")',
          // Forces the grain to be the same size on all screen sizes
          backgroundSize: '200px', 
          // Tells the browser to use GPU acceleration for the animation
          willChange: 'transform', 
        }}
      />
    </div>
  );
}