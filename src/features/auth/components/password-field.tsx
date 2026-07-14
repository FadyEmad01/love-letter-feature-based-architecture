"use client";

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  showStrength?: boolean;
  placeholder?: string;
  "aria-invalid"?: boolean;
  className?: string;
}

export function PasswordField({
  id: externalId,
  value,
  onChange,
  showStrength = false,
  placeholder = "********",
  className,
  ...props
}: PasswordFieldProps & Omit<React.ComponentProps<"input">, "id" | "value" | "onChange" | "type">) {
  const generatedId = useId();
  const id = externalId || generatedId;
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ];

  const strength = requirements.map((req) => ({
    met: req.regex.test(value),
    text: req.text,
  }));

  const strengthScore = strength.filter((r) => r.met).length;

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <Input
          id={id}
          aria-describedby={showStrength ? `${id}-description` : undefined}
          className="pe-9 bg-white/50"
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? (
            <EyeOffIcon aria-hidden="true" size={16} />
          ) : (
            <EyeIcon aria-hidden="true" size={16} />
          )}
        </button>
      </div>

      {showStrength && (
        <>
          {/* <div
            aria-label="Password strength"
            aria-valuemax={4}
            aria-valuemin={0}
            aria-valuenow={strengthScore}
            className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            tabIndex={-1}
          >
            <div
              className={cn("h-full transition-all duration-500 ease-out", getStrengthColor(strengthScore))}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div> */}

          <p
            className="text-sm font-medium text-foreground"
            id={`${id}-description`}
          >
            {getStrengthText(strengthScore)}, Must contain:
          </p>

          <ul aria-label="Password requirements" className="space-y-1">
            {strength.map((req) => (
              <li className="flex items-center gap-2" key={req.text}>
                {req.met ? (
                  <CheckIcon aria-hidden="true" size={16} className="shrink-0 text-emerald-500" />
                ) : (
                  <XIcon aria-hidden="true" size={16} className="shrink-0 text-muted-foreground/80" />
                )}
                <span className={cn("text-xs", req.met ? "text-emerald-600" : "text-muted-foreground")}>
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
