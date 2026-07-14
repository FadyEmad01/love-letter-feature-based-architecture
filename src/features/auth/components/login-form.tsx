"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goeyToast } from "goey-toast";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordField } from "@/features/auth/components/password-field";
import { authClient } from "@/features/auth/lib/client";
import { loginSchema, type LoginInput } from "@/features/auth/lib/validation";

const toastStyle = {
  spring: false,
  showProgress: false,
  showTimestamp: false,
  fillColor: "#FFFFFF",
  timing: { displayDuration: 6000 },
} as const;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        goeyToast.update(toastId, {
          type: "error",
          title: error?.message || "Something went wrong",
          description: "Something went wrong, try again",
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
      goeyToast.update(toastId, {
        type: "error",
        title: message,
        description: "Something went wrong, try again",
        icon: null,
        ...toastStyle,
      });
      setIsLoading(false);
    }
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <div className="flex flex-col gap-6 relative z-[100]">
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
          </Field>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register">Sign up</Link>
      </FieldDescription>
    </div>
  );
}