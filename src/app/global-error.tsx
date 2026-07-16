"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#efefe3",
          fontFamily: "system-ui, sans-serif",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            fontFamily: "var(--font-advercase), system-ui, sans-serif",
          }}
        >
          Something went wrong
        </h1>
        <p style={{ color: "#71717a" }}>{error.message}</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #d4d4d8",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
