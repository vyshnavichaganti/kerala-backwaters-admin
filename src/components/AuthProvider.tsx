"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if Supabase keys are configured
    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");
    setIsDemo(isMockMode);

    if (isMockMode) {
      // In demo mode, read session from localStorage
      const mockSession = localStorage.getItem("crm_mock_session");
      if (mockSession) {
        setUser(JSON.parse(mockSession));
      }
      setLoading(false);
      return;
    }

    // Standard Supabase Auth check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect handling
  useEffect(() => {
    if (loading) return;

    const isLoginPath = pathname === "/login";
    
    if (!user && !isLoginPath) {
      router.push("/login");
    } else if (user && isLoginPath) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    setLoading(true);
    if (isDemo) {
      localStorage.removeItem("crm_mock_session");
      setUser(null);
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
