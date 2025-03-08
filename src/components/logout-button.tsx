"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LogoutButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  children?: React.ReactNode;
}

export function LogoutButton({
  className,
  children,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className={cn("", className)}
      {...props}
    >
      {children || "Logout"}
    </Button>
  );
}
