"use client";

import { ProfileView } from "@/features/dashboard/components/profile-view";
import { useProfile } from "@/features/dashboard/hooks/use-profile";

interface ProfilePageProps {
  userName: string;
  userEmail: string;
}

export function ProfilePage({
  userName: initialUserName,
  userEmail,
}: ProfilePageProps) {
  const { userName, editName, setEditName, isUpdating, handleUpdateProfile } =
    useProfile(initialUserName);

  return (
    <ProfileView
      userName={userName}
      editName={editName}
      onEditNameChange={setEditName}
      userEmail={userEmail}
      isUpdating={isUpdating}
      onSubmit={handleUpdateProfile}
    />
  );
}
