"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { goeyToast } from "goey-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/features/auth/components/google-icon";
import { PasswordField } from "@/features/auth/components/password-field";
import { authClient } from "@/features/auth/lib/auth-client";
import { type LoginInput, loginSchema } from "@/features/auth/lib/validation";

const toastStyle = {
  spring: false,
  showProgress: false,
  showTimestamp: false,
  fillColor: "#FFFFFF",
  timing: { displayDuration: 6000 },
} as const;

const isGoogleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    const toastId = goeyToast("Signing in...", {
      ...toastStyle,
      icon: <Spinner />,
    });

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const isRateLimited =
          (error as { status?: number }).status === 429 ||
          error?.message?.toLowerCase().includes("too many requests");

        goeyToast.update(toastId, {
          type: "error",
          title: isRateLimited
            ? "Too many attempts"
            : error?.message || "Something went wrong",
          description: isRateLimited
            ? "You've made too many requests. Please wait a minute before trying again."
            : "Something went wrong, try again",
          icon: null,
          ...toastStyle,
        });
        setIsLoading(false);
        return;
      }

      goeyToast.update(toastId, {
        type: "success",
        title: "Signed in successfully!",
        description: "Redirecting to dashboard...",
        icon: null,
        ...toastStyle,
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      const isRateLimited =
        message.toLowerCase().includes("too many requests") ||
        message.toLowerCase().includes("rate limit");
      goeyToast.update(toastId, {
        type: "error",
        title: isRateLimited ? "Too many attempts" : message,
        description: isRateLimited
          ? "You've made too many requests. Please wait a minute before trying again."
          : "Something went wrong, try again",
        icon: null,
        ...toastStyle,
      });
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    if (error) {
      goeyToast("Google sign-in failed", {
        description: error?.message || "Something went wrong, try again",
        ...toastStyle,
      });
      setIsGoogleLoading(false);
    }
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <div className="flex flex-col gap-6 relative z-100">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-start gap-2 text-start">
            <h1 className="text-4xl font-normal font-advercase">
              welcome back
            </h1>
          </div>

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              {...form.register("email")}
              type="email"
              placeholder="m@example.com"
              aria-invalid={!!emailError}
              className="bg-white/50"
            />
            <FieldError>{emailError}</FieldError>
          </Field>

          <Field data-invalid={!!passwordError}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordField
              id="password"
              value={form.watch("password")}
              onChange={(value) =>
                form.setValue("password", value, { shouldValidate: true })
              }
              aria-invalid={!!passwordError}
              showStrength={false}
            />
            <FieldError>{passwordError}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {isGoogleEnabled && (
            <>
              <FieldSeparator className="">Or continue with</FieldSeparator>

              <Field>
                <Button
                  disabled={isGoogleLoading}
                  className="bg-white/50 hover:bg-white/70 text-foreground"
                  variant="default"
                  type="button"
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon className="size-4" />
                  {isGoogleLoading ? "Redirecting..." : "Login with Google"}
                </Button>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
      </FieldDescription>
    </div>
  );
}
