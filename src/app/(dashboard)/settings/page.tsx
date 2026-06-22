"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { User, Lock, Mail, MessageSquare, Bell, Moon, Sun, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [adminName, setAdminName] = useState("Kerala Planner Admin");
  const [whatsappNum, setWhatsappNum] = useState("+91 98765 43210");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [toastAlerts, setToastAlerts] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Profile settings saved successfully");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    triggerToast("Admin password changed successfully");
  };

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("System communication numbers updated");
  };

  const userEmail = user?.email || "admin@keralabackwaters.com";

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 border border-gold text-cream-100 py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-gold tracking-wide">System Settings</h2>
        <p className="text-xs text-foreground/50">Manage admin credentials, WhatsApp routing keys, and email integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card & Password (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Profile settings */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold border-b border-border pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              <span>Admin Profile Details</span>
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Full Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Login Email (Read-Only)</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-background/50 border border-border rounded-lg p-2.5 text-sm text-foreground/50 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="bg-gold hover:bg-gold-hover text-forest-950 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold border-b border-border pb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              <span>Change Password</span>
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-sm">
              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-gold hover:bg-gold-hover text-forest-950 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow"
              >
                Change Password
              </button>
            </form>
          </div>

        </div>

        {/* Notifications & System config (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* WhatsApp Destination */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold border-b border-border pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>Communication Keys</span>
            </h3>
            
            <form onSubmit={handleSaveSystemSettings} className="space-y-4 text-sm">
              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Lead WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappNum}
                  onChange={(e) => setWhatsappNum(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold"
                />
                <span className="text-[10px] text-foreground/45 mt-1 block">
                  All customer WhatsApp redirects will route queries to this administrator contact.
                </span>
              </div>

              <button
                type="submit"
                className="bg-gold hover:bg-gold-hover text-forest-950 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow"
              >
                Save Channels
              </button>
            </form>
          </div>

          {/* Alert Toggles */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold border-b border-border pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gold" />
              <span>System Alerts</span>
            </h3>

            <div className="space-y-4 font-sans text-sm">
              
              {/* Email notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-foreground">Email Notifications</h5>
                  <p className="text-[10px] text-foreground/50">Send copy of client bookings to dashboard email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
              </div>

              {/* WhatsApp alerts */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <h5 className="font-semibold text-foreground">WhatsApp Redirects</h5>
                  <p className="text-[10px] text-foreground/50">Pre-fill chat strings for direct client chats.</p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
              </div>

              {/* Toast Alerts */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div>
                  <h5 className="font-semibold text-foreground">Toast Modals</h5>
                  <p className="text-[10px] text-foreground/50">Show instant success toasts on action updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={toastAlerts}
                  onChange={(e) => setToastAlerts(e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
