"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FieldDescription, FieldGroup } from "@/components/ui/field";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex flex-col gap-6 relative z-100">
      <FieldGroup>
        <div className="flex flex-col items-start gap-2 text-start">
          <h1 className="text-4xl font-normal font-advercase">
            check your email
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Email"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            {email ? (
              <>
                We&apos;ve sent a verification link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              "We&apos;ve sent you a verification link."
            )}
          </p>

          <p className="text-muted-foreground text-center text-xs">
            Click the link in your email to verify your account. The link
            expires in 1 hour.
          </p>
        </div>
      </FieldGroup>

      <FieldDescription className="text-center">
        Already verified? <Link href="/auth/login">Sign in</Link>
      </FieldDescription>
    </div>
  );
}
