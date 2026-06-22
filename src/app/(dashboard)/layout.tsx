"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { 
  LayoutDashboard, Users, Ship, BarChart3, Settings, 
  Menu, X, LogOut, UserCircle, Bell, Sun, Moon
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Packages", href: "/packages", icon: Ship },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("light");
      setThemeMode("light");
    } else {
      root.classList.remove("light");
      setThemeMode("dark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif text-sm tracking-widest text-gold uppercase">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!user) {
    return null; // AuthProvider will trigger redirect to login
  }

  const userEmail = user.email || "admin@keralabackwaters.com";
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Header Logo */}
          <div className="p-6 border-b border-border flex justify-between items-center">
            <Link href="/dashboard" className="flex flex-col text-left">
              <span className="font-serif text-lg font-bold tracking-wide text-gold">
                KERALA CRM
              </span>
              <span className="text-[9px] tracking-[0.25em] text-foreground/50 uppercase -mt-0.5 font-sans font-medium">
                Operations Desk
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-foreground/60 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3.5 px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all group ${
                    isActive 
                      ? "bg-gold text-forest-950 shadow-md font-semibold" 
                      : "text-foreground/75 hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-forest-950" : "text-gold"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-border space-y-3 bg-background/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center font-bold text-xs">
              {userInitials}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">{userEmail}</p>
              <p className="text-[10px] text-foreground/50 font-sans">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center space-x-2 bg-red-950/20 hover:bg-red-950/45 text-red-400 border border-red-500/20 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card flex justify-between items-center px-4 sm:px-6 shrink-0 relative z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-foreground/75 hover:text-gold p-1 rounded"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide hidden sm:block">
              {pathname === "/" ? "Dashboard Metrics" : 
               pathname === "/leads" ? "Leads Management" : 
               pathname === "/packages" ? "Tour Packages" : 
               pathname === "/analytics" ? "Deep Analytics" : "System Settings"}
            </h1>
          </div>

          {/* Quick Header Utility Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border text-gold hover:bg-gold/10 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg border border-border text-gold hover:bg-gold/10 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl p-4 text-left z-50">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gold mb-2 border-b border-border pb-1">Notifications</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">New lead registered</p>
                      <p className="text-[10px] text-foreground/50">Rahul Sharma submitted query for Sunset Cruise.</p>
                      <p className="text-[9px] text-gold mt-0.5">2 min ago</p>
                    </div>
                    <div className="text-xs border-t border-border pt-2">
                      <p className="font-semibold text-foreground">Welcome to Kerala CRM</p>
                      <p className="text-[10px] text-foreground/50">Admin session loaded successfully.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Page */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>

    </div>
  );
}
