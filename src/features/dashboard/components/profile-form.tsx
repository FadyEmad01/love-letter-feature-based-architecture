"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface ProfileFormProps {
  editName: string;
  onEditNameChange: (value: string) => void;
  userName: string;
  userEmail: string;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileForm({
  editName,
  onEditNameChange,
  userName,
  userEmail,
  isUpdating,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            placeholder="Your name"
            required
          />
        </Field>

        <Field data-disabled>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input id="email" type="email" value={userEmail} disabled />
          <FieldDescription>Email cannot be changed directly.</FieldDescription>
        </Field>

        <Button
          type="submit"
          disabled={
            isUpdating || editName.trim() === "" || editName === userName
          }
        >
          {isUpdating && <Spinner data-icon="inline-start" />}
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </FieldGroup>
    </form>
  );
}
