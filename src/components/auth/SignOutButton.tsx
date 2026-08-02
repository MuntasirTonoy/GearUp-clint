"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      <LogOut />
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
