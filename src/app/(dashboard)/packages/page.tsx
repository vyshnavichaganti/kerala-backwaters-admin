"use client";

import { useState } from "react";
import { Ship, Tag, Edit2, Plus, Info, CheckCircle2 } from "lucide-react";

interface Package {
  id: string;
  title: string;
  price: string;
  category: "Houseboat" | "Cruise" | "Munnar Hills" | "Combo";
  status: "Active" | "Draft";
  routes: string;
}

const INITIAL_PACKAGES: Package[] = [
  { id: "pkg-1", title: "1 Day Alleppey Cruise", price: "₹2,499", category: "Cruise", status: "Active", routes: "Alleppey Backwaters" },
  { id: "pkg-2", title: "Luxury Houseboat Stay", price: "₹7,999", category: "Houseboat", status: "Active", routes: "Alleppey - Kumarakom" },
  { id: "pkg-3", title: "Couple Honeymoon Package", price: "₹14,999", category: "Combo", status: "Active", routes: "Airport + Alleppey + resort" },
  { id: "pkg-4", title: "Munnar + Alleppey Package", price: "₹11,999", category: "Combo", status: "Active", routes: "Munnar hills + Alleppey stay" },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEditRate = (id: string, currentPrice: string) => {
    const newPrice = prompt(`Enter new base rate for package:`, currentPrice);
    if (newPrice && newPrice !== currentPrice) {
      setPackages(prev => prev.map(p => 
        p.id === id ? { ...p, price: newPrice } : p
      ));
      triggerToast(`Base rate updated successfully to ${newPrice}`);
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 border border-gold text-cream-100 py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Toolbar header */}
      <div className="bg-card border border-border p-4 rounded-2xl flex justify-between items-center shadow-sm">
        <div>
          <h2 className="font-serif text-lg font-bold text-gold tracking-wide">Base Packages Rates</h2>
          <p className="text-xs text-foreground/50">Manage default service packages prices published on the website.</p>
        </div>
        <button
          onClick={() => triggerToast("Add package feature is in demo mode.")}
          className="bg-gold hover:bg-gold-hover text-forest-950 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-card border border-border p-6 rounded-2xl flex justify-between items-start hover:border-gold/30 transition-all duration-300 relative group"
          >
            <div className="space-y-3">
              <span className="bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {pkg.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-foreground mt-1 group-hover:text-gold transition-colors">
                {pkg.title}
              </h3>
              <p className="text-xs text-foreground/50 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Default Route: {pkg.routes}</span>
              </p>
            </div>

            <div className="flex flex-col items-end justify-between h-24 shrink-0 font-sans">
              <div>
                <span className="text-[10px] text-foreground/40 block">Published Price</span>
                <span className="text-2xl font-bold text-gold block">{pkg.price}</span>
              </div>
              
              <button
                onClick={() => handleEditRate(pkg.id, pkg.price)}
                className="p-1.5 rounded-lg border border-border text-foreground hover:bg-gold/10 hover:text-gold transition-all flex items-center space-x-1"
                title="Edit Base Rate"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider px-1">Rate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
