import { Suspense } from "react";
import { AuthImagePanel } from "@/features/auth/components/auth-image-panel";
import VerifyEmailForm from "@/features/auth/components/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense>
              <VerifyEmailForm />
            </Suspense>
          </div>
        </div>
      </div>
      <AuthImagePanel />
    </div>
  );
}
