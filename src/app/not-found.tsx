import Link from "next/link";
import { LayoutDashboard, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-500/10 text-red-400 p-5 rounded-full border border-red-500/20">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-gold">404</h1>
          <h2 className="font-serif text-xl font-bold tracking-wide">Invalid CRM Route</h2>
          <p className="text-xs text-foreground/50 font-sans leading-relaxed">
            The admin resource or panel route you attempted to access does not exist in this database environment.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-forest-950 px-6 py-3.5 rounded-lg font-bold font-sans uppercase tracking-wider text-xs shadow transition-colors border border-gold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
