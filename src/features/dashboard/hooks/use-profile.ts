"use client";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/features/auth/lib/auth-client";

export function useProfile(initialUserName: string) {
  const [userName, setUserName] = useState(initialUserName);
  const [editName, setEditName] = useState(initialUserName);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsUpdating(true);
    const toastId = goeyToast("Updating profile...");

    try {
      const { error } = await authClient.updateUser({ name: editName });

      if (error) {
        goeyToast.update(toastId, {
          type: "error",
          title: "Update failed",
          description: error.message || "Something went wrong",
        });
        setIsUpdating(false);
        return;
      }

      goeyToast.update(toastId, {
        type: "success",
        title: "Profile updated successfully!",
      });
      setUserName(editName);
      router.refresh();
    } catch {
      goeyToast.update(toastId, {
        type: "error",
        title: "Update failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { userName, editName, setEditName, isUpdating, handleUpdateProfile };
}
