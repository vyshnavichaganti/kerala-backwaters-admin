"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
      {/* Centered Golden Session Loader */}
      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="font-serif text-xs tracking-widest text-gold uppercase animate-pulse">
        Verifying Session...
      </p>
    </div>
  );
}
