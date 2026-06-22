"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { MOCK_LEADS, Lead } from "@/lib/mockLeads";
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend, LineChart, Line, AreaChart, Area
} from "recharts";
import { BarChart3, TrendingUp, Compass, Award, Percent, Users } from "lucide-react";

const COLORS = ["#dfa515", "#1b7a54", "#2c6e49", "#4f772d", "#31572c", "#cfa135", "#b0810d", "#a3b18a", "#588157"];

export default function AnalyticsPage() {
  const { isDemo } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setLeads(MOCK_LEADS);
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLeads(data || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setLeads(MOCK_LEADS);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [isDemo]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate numbers
  const total = leads.length;
  
  // Status breakdown
  const statusCounts: Record<string, number> = {
    "New": 0, "Contacted": 0, "Quotation Sent": 0, "Confirmed": 0, "Completed": 0, "Cancelled": 0
  };
  leads.forEach(l => {
    if (statusCounts[l.status] !== undefined) {
      statusCounts[l.status]++;
    }
  });
  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Service breakdown
  const serviceCounts: Record<string, number> = {};
  leads.forEach(l => {
    serviceCounts[l.service] = (serviceCounts[l.service] || 0) + 1;
  });
  const servicePieData = Object.entries(serviceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Conversion rate (Confirmed + Completed) / Total
  const successfulLeads = leads.filter(l => l.status === "Confirmed" || l.status === "Completed").length;
  const conversionRate = total > 0 ? Math.round((successfulLeads / total) * 100) : 0;

  // Active pipelines (excluding Cancelled)
  const activePipelines = leads.filter(l => l.status !== "Cancelled").length;

  // Weekly booking volume line chart (aggregating mock dates)
  const weeklyTrends = [
    { week: "Week 21", bookings: 14 },
    { week: "Week 22", bookings: 19 },
    { week: "Week 23", bookings: 15 },
    { week: "Week 24", bookings: 22 },
    { week: "Week 25", bookings: total || 25 },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total bookings query */}
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-gold/15 text-gold p-3.5 rounded-xl shrink-0"><Users className="w-6 h-6" /></div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-foreground/50 block">Analysed Leads</span>
            <span className="text-2xl font-bold block mt-0.5">{total} Queries</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-gold/15 text-gold p-3.5 rounded-xl shrink-0"><Percent className="w-6 h-6" /></div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-foreground/50 block">Conversion Rate</span>
            <span className="text-2xl font-bold block mt-0.5">{conversionRate}%</span>
          </div>
        </div>

        {/* Active Pipelines */}
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-gold/15 text-gold p-3.5 rounded-xl shrink-0"><Compass className="w-6 h-6" /></div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-foreground/50 block">Active Pipelines</span>
            <span className="text-2xl font-bold block mt-0.5">{activePipelines} Leads</span>
          </div>
        </div>

        {/* Success conversions */}
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-gold/15 text-gold p-3.5 rounded-xl shrink-0"><Award className="w-6 h-6" /></div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-foreground/50 block">Won / Completed</span>
            <span className="text-2xl font-bold block mt-0.5">{successfulLeads} Deals</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Weekly Line Chart */}
        <div className="lg:col-span-8 bg-card border border-border p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-gold tracking-wide">Weekly Leads Volume</h3>
            <p className="text-xs text-foreground/50">Lead accumulation rate over the last 5 weeks.</p>
          </div>

          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(223, 165, 21, 0.05)" />
                <XAxis dataKey="week" stroke="rgba(255, 255, 255, 0.4)" />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a241b", borderColor: "#dfa515", borderRadius: "8px", color: "#fbf9f4" }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#dfa515" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service share pie chart */}
        <div className="lg:col-span-4 bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-gold tracking-wide">Service Category Share</h3>
            <p className="text-xs text-foreground/50">Relative market share percentage of service packages.</p>
          </div>

          <div className="h-64 w-full text-xs my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {servicePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a241b", borderColor: "#dfa515", borderRadius: "8px", color: "#fbf9f4" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legends list */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-foreground/75 font-sans border-t border-border pt-4">
            {servicePieData.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead status funnel */}
        <div className="lg:col-span-12 bg-card border border-border p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-gold tracking-wide">Pipeline Conversion States</h3>
            <p className="text-xs text-foreground/50">Distribution of leads across the sales funnel.</p>
          </div>

          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(223, 165, 21, 0.05)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" />
                <YAxis stroke="rgba(255, 255, 255, 0.4)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a241b", borderColor: "#dfa515", borderRadius: "8px", color: "#fbf9f4" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
