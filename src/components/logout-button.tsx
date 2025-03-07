"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };
  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}
