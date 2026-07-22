"use client";

export function DecorativeBackground() {
  return (
    <>
      <div className="absolute top-0 left-0 size-[500px] bg-brand-pink/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 right-0 size-[400px] bg-brand-cream/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
    </>
  );
}
