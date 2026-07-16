"use client";

import localFont from "next/font/local";
import "../styles/globals.css";

const advercase = localFont({
  src: "../assets/fonts/Advercase-Regular.woff2",
  variable: "--font-advercase",
});

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en" className={advercase.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
          <h1 className="text-[2rem] font-bold font-advercase tracking-wider">
            Something went wrong
          </h1>
          <p className="text-muted-foreground font-sans">{error.message}</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="cursor-pointer rounded-lg border border-border bg-white px-3 py-1 text-sm"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
