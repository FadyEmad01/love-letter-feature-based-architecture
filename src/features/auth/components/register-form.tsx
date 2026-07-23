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
import {
  type RegisterInput,
  registerSchema,
} from "@/features/auth/lib/validation";

const toastStyle = {
  spring: false,
  showProgress: false,
  showTimestamp: false,
  fillColor: "#FFFFFF",
  timing: { displayDuration: 6000 },
} as const;

const isGoogleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    const toastId = goeyToast("Creating account...", {
      ...toastStyle,
      icon: <Spinner />,
    });

    try {
      const { confirmPassword: _, ...apiData } = data;
      const { error } = await authClient.signUp.email(apiData);

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
        title: "Account created!",
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

  const nameError = form.formState.errors.name?.message;
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;
  const confirmPasswordError = form.formState.errors.confirmPassword?.message;

  return (
    <div className="flex flex-col gap-6 relative z-100">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-start gap-2 text-start">
            <h1 className="text-4xl font-normal font-advercase">join us</h1>
          </div>

          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Your name"
              aria-invalid={!!nameError}
              className="bg-white/50"
            />
            <FieldError>{nameError}</FieldError>
          </Field>

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
              showStrength
              aria-invalid={!!passwordError}
            />
            {/* <FieldError>{passwordError}</FieldError> */}
          </Field>

          <Field data-invalid={!!confirmPasswordError}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordField
              id="confirmPassword"
              value={form.watch("confirmPassword")}
              onChange={(value) =>
                form.setValue("confirmPassword", value, {
                  shouldValidate: true,
                })
              }
              aria-invalid={!!confirmPasswordError}
            />
            <FieldError>{confirmPasswordError}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
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
                  {isGoogleLoading ? "Redirecting..." : "Sign up with Google"}
                </Button>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Already have an account? <Link href="/auth/login">Sign in</Link>
      </FieldDescription>
    </div>
  );
}
