import Link from "next/link";
import NoiseOverlay from "@/components/background/NoiseOverlay";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-bold font-heading">404</h1>
        <p className="text-muted-foreground text-lg">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <NoiseOverlay />
    </>
  );
}
