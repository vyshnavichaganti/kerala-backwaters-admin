"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, LogIn, Ship, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(5, { message: "Password must be at least 5 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setAuthError(null);

    const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");

    if (isMockMode) {
      // Mock login for demo/design review
      setTimeout(() => {
        const mockUser = {
          id: "mock-admin-uuid",
          email: data.email,
          role: "authenticated",
          user_metadata: { full_name: "Lead Planner (Demo)" },
          created_at: new Date().toISOString(),
        };
        localStorage.setItem("crm_mock_session", JSON.stringify(mockUser));
        setIsSubmitting(false);
        router.push("/");
        // Reload page to let AuthProvider pick up the changes
        window.location.href = "/";
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      router.push("/");
      window.location.href = "/";
    } catch (err: any) {
      console.error("Login error:", err);
      setAuthError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Luxury Golden Glow Circle */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel text-foreground p-8 rounded-2xl border border-gold/15 shadow-2xl space-y-6">
          
          {/* Logo & Branding */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-gold/10 text-gold p-3.5 rounded-2xl border border-gold/30">
                <Ship className="w-8 h-8" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold tracking-wide text-gold">
                KERALA BACKWATERS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-cream-100/70 uppercase -mt-0.5 font-sans">
                Admin CRM Portal
              </span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-border"></div>

          {authError && (
            <div className="bg-red-950/45 border border-red-500/35 rounded-lg p-3 text-xs text-red-300 flex items-center space-x-2 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gold font-sans font-semibold mb-1">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="e.g. admin@keralabackwaters.com"
                  {...register("email")}
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-gold transition-colors font-sans"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 font-sans">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gold font-sans font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold/60">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-3 text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-gold transition-colors font-sans"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-sans">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-hover text-forest-950 py-3 rounded-lg font-bold font-sans uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center space-x-2 border border-gold disabled:opacity-50 mt-6"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Info Notice */}
          <div className="text-center font-sans">
            <p className="text-[11px] text-foreground/50">
              *Demo Mode enabled: enter any email/password to log in.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
