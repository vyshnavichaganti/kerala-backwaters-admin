"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard runtime error caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6 bg-card border border-border p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-center">
          <div className="bg-red-500/10 text-red-400 p-4 rounded-full border border-red-500/20">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold tracking-wide text-gold">Dashboard Error</h2>
          <p className="text-xs text-foreground/50 font-sans leading-relaxed">
            An unexpected error occurred while loading your operations metrics. Let's try resetting the administrative panel view.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-forest-950 px-5 py-3 rounded-lg font-bold font-sans uppercase tracking-wider text-xs shadow transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>
    </main>
  );
}
