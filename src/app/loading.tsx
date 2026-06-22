export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
      {/* Admin CRM loader */}
      <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="font-serif text-xs tracking-widest text-gold uppercase animate-pulse">
        Syncing Admin Operations...
      </p>
    </div>
  );
}
