import Image from "next/image";
import RegisterForm from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:flex min-h-svh items-center justify-center">
        <Image
          src="/images/bg-hero.webp"
          alt="Background"
          fill
          sizes="50vw"
          className="object-cover brightness-[0.6]"
        />
        <Image
          src="/svg/logo.svg"
          alt="Logo"
          width={320}
          height={320}
          className="relative z-10"
        />
      </div>
    </div>
  );
}
