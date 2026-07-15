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
import { authClient } from "@/features/auth/lib/auth-client";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/lib/validation";

const toastStyle = {
  spring: false,
  showProgress: false,
  showTimestamp: false,
  fillColor: "#FFFFFF",
  timing: { displayDuration: 6000 },
} as const;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
      const { error } = await authClient.signUp.email({
        name: data.name,
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

  const nameError = form.formState.errors.name?.message;
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

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
            <FieldError>{passwordError}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </FieldGroup>
      </form>
      <FieldDescription className="text-center">
        Already have an account?{" "}
        <Link href="/auth/login">Sign in</Link>
      </FieldDescription>
    </div>
  );
}
