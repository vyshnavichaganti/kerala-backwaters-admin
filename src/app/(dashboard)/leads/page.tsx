"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { MOCK_LEADS, Lead } from "@/lib/mockLeads";
import { 
  Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Edit2, 
  Trash2, Download, AlertCircle, CheckCircle2, MessageCircle, X, ExternalLink,
  Plus
} from "lucide-react";

const STATUS_OPTIONS: Lead["status"][] = [
  "New",
  "Contacted",
  "Quotation Sent",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const SERVICE_OPTIONS = [
  "Premium Houseboat",
  "Luxury Houseboat",
  "Sunset Cruise",
  "Dinner Cruise",
  "Couple Cruise",
  "Honeymoon Package",
  "Munnar Tour",
  "Airport Pickup",
  "Taxi Service",
];

export default function LeadsPage() {
  const { isDemo } = useAuth();
  
  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editStatusValue, setEditStatusValue] = useState<Lead["status"]>("New");

  // Add Lead Form State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAltPhone, setNewAltPhone] = useState("");
  const [newService, setNewService] = useState("Premium Houseboat");
  const [newTravelDate, setNewTravelDate] = useState("");
  const [newGuests, setNewGuests] = useState(2);
  const [newMessage, setNewMessage] = useState("");

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newService || !newTravelDate) {
      alert("Please fill all required fields.");
      return;
    }

    const newLeadItem = {
      full_name: newName,
      phone_number: newPhone,
      alternate_number: newAltPhone || null,
      service: newService,
      travel_date: newTravelDate,
      guests: Number(newGuests),
      message: newMessage || null,
      status: "New" as const,
    };

    if (isDemo) {
      const mockNewLead: Lead = {
        id: `lead-mock-${Date.now()}`,
        ...newLeadItem,
        created_at: new Date().toISOString(),
      };
      setLeads(prev => [mockNewLead, ...prev]);
      setAddModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewAltPhone("");
      setNewService("Premium Houseboat");
      setNewTravelDate("");
      setNewGuests(2);
      setNewMessage("");
      triggerToast("Lead added successfully (Demo Mode)");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([newLeadItem])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setLeads(prev => [data[0], ...prev]);
      } else {
        fetchLeads();
      }

      setAddModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewAltPhone("");
      setNewService("Premium Houseboat");
      setNewTravelDate("");
      setNewGuests(2);
      setNewMessage("");
      triggerToast("Lead added successfully to Supabase");
    } catch (err: any) {
      console.error("Add lead error:", err);
      triggerToast("Error adding lead: " + err.message);
    }
  };

  // Fetch leads on mount / toggle mode
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    if (isDemo) {
      setLeads(MOCK_LEADS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error("Leads list fetch error:", err);
      setError(err.message || "Failed to load leads from Supabase.");
      // Fallback
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [isDemo]);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filters logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number.includes(searchTerm) ||
      (lead.message && lead.message.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesService = serviceFilter === "All" || lead.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status Action Handlers
  const handleOpenEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatusValue(lead.status);
    setEditModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead) return;
    
    if (isDemo) {
      // Mock update
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, status: editStatusValue } : lead
      ));
      setEditModalOpen(false);
      triggerToast(`Lead status updated to ${editStatusValue}`);
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: editStatusValue })
        .eq("id", selectedLead.id);

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, status: editStatusValue } : lead
      ));
      setEditModalOpen(false);
      triggerToast(`Lead status updated to ${editStatusValue}`);
    } catch (err: any) {
      console.error("Status update error:", err);
      triggerToast("Error updating status: " + err.message);
    }
  };

  // Delete Action Handlers
  const handleOpenDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;

    if (isDemo) {
      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));
      setDeleteConfirmOpen(false);
      triggerToast("Lead deleted successfully (Demo)");
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", selectedLead.id);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));
      setDeleteConfirmOpen(false);
      triggerToast("Lead deleted successfully from database");
    } catch (err: any) {
      console.error("Delete error:", err);
      triggerToast("Error deleting lead: " + err.message);
    }
  };

  // CSV Export Engine
  const handleExportCSV = (isExcel = false) => {
    if (filteredLeads.length === 0) {
      triggerToast("No leads available to export.");
      return;
    }

    const headers = ["ID", "Name", "Phone", "Alt Phone", "Service", "Travel Date", "Guests", "Message", "Status", "Created At"];
    const rows = filteredLeads.map(lead => [
      lead.id,
      lead.full_name,
      lead.phone_number,
      lead.alternate_number || "",
      lead.service,
      lead.travel_date,
      lead.guests,
      (lead.message || "").replace(/"/g, '""'), // escape quotes
      lead.status,
      lead.created_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const filename = isExcel 
      ? `kerala_leads_excel_${new Date().toISOString().split("T")[0]}.csv`
      : `kerala_leads_${new Date().toISOString().split("T")[0]}.csv`;
      
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported ${filteredLeads.length} leads successfully`);
  };

  // WhatsApp helper
  const handleOpenWhatsAppChat = (lead: Lead) => {
    // Format a prefilled template message to the client
    const text = `Hello ${lead.full_name}, thank you for booking a ${lead.service} with Kerala Backwaters Experience. I am your reservation coordinator and I have received your request for ${lead.travel_date}. Let me know if you would like me to send you the customized quote itinerary?`;
    // Clean phone number (remove spaces, plus symbols for URL)
    const cleanPhone = lead.phone_number.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const getStatusClass = (status: Lead["status"]) => {
    switch (status) {
      case "New": return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Contacted": return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "Quotation Sent": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      case "Confirmed": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Completed": return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "Cancelled": return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-900 border border-gold text-cream-100 py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-foreground/45" />
          <input
            type="text"
            placeholder="Search by client name, phone or notes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-gold placeholder-foreground/35"
          />
        </div>

        {/* Filters and Exports */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status select */}
          <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-foreground/50 px-1">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs py-1 px-2 focus:outline-none focus:border-none"
            >
              <option value="All" className="bg-card">All Statuses</option>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-card">{opt}</option>
              ))}
            </select>
          </div>

          {/* Service select */}
          <div className="flex items-center space-x-1 bg-background border border-border rounded-xl px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-foreground/50 px-1">Service</span>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs py-1 px-2 focus:outline-none focus:border-none"
            >
              <option value="All" className="bg-card">All Services</option>
              {SERVICE_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-card">{opt}</option>
              ))}
            </select>
          </div>

          {/* Exports & Create Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExportCSV(false)}
              className="bg-card hover:bg-gold/10 text-gold border border-border px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              title="Export CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => handleExportCSV(true)}
              className="bg-card hover:bg-gold/10 text-gold border border-border px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              title="Download Excel spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-gold hover:bg-gold-hover text-forest-950 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 border border-gold"
              title="Add New Lead Manually"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>

        </div>

      </div>

      {/* Main Leads Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/40 text-foreground/60 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Travel Date</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-foreground/50 italic">
                    No leads found matching your search filters.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/2 align-middle">
                    <td className="p-4 pl-6">
                      <div className="font-semibold">{lead.full_name}</div>
                      <div className="text-[10px] text-foreground/40 font-sans mt-0.5">
                        Created: {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-xs">{lead.phone_number}</div>
                      {lead.alternate_number && (
                        <div className="text-[10px] text-foreground/50 mt-0.5">Alt: {lead.alternate_number}</div>
                      )}
                    </td>
                    <td className="p-4 text-gold/90 font-medium">{lead.service}</td>
                    <td className="p-4 font-sans">{lead.travel_date}</td>
                    <td className="p-4 font-sans">{lead.guests} Pax</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase ${getStatusClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => { setSelectedLead(lead); setViewModalOpen(true); }}
                          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-gold/15 hover:text-gold transition-all"
                          title="View lead notes"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(lead)}
                          className="p-1.5 rounded-lg border border-border text-gold hover:bg-gold/15 hover:text-gold transition-all"
                          title="Edit Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenWhatsAppChat(lead)}
                          className="p-1.5 rounded-lg border border-emerald-500/20 text-[#25d366] hover:bg-[#25d366]/10 transition-all"
                          title="Chat via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(lead)}
                          className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-background/20 flex items-center justify-between font-sans">
            <span className="text-xs text-foreground/50">
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredLeads.length} leads total)
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 rounded-lg border border-border hover:bg-gold/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-lg border border-border hover:bg-gold/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-left">
              <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase ${getStatusClass(selectedLead.status)}`}>
                {selectedLead.status}
              </span>
              <h3 className="font-serif text-2xl font-bold text-gold tracking-wide mt-2">{selectedLead.full_name}</h3>
              <p className="text-[10px] text-foreground/40 font-sans mt-0.5">Lead Reference: {selectedLead.id}</p>
            </div>

            <div className="h-[1px] w-full bg-border"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm font-sans">
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/50">Primary Contact</p>
                <p className="font-semibold text-foreground mt-0.5">{selectedLead.phone_number}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/50">Alternate Contact</p>
                <p className="font-semibold text-foreground mt-0.5">{selectedLead.alternate_number || "None Provided"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/50">Requested Package</p>
                <p className="font-semibold text-gold mt-0.5">{selectedLead.service}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-foreground/50">Travel Date</p>
                <p className="font-semibold text-foreground mt-0.5">{selectedLead.travel_date} ({selectedLead.guests} pax)</p>
              </div>
            </div>

            <div className="text-left font-sans">
              <p className="text-[10px] uppercase font-bold text-foreground/50 mb-1">Notes & Special Message</p>
              <div className="bg-background/50 border border-border p-4 rounded-xl text-sm italic leading-relaxed text-foreground/80 whitespace-pre-wrap">
                {selectedLead.message || "No custom requirements specified by client."}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleOpenWhatsAppChat(selectedLead)}
                className="flex-1 bg-[#25d366] hover:bg-[#20ba5a] text-white py-3 rounded-lg font-bold font-sans uppercase tracking-wider text-xs shadow flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Client</span>
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="flex-1 bg-transparent border border-border text-foreground hover:bg-white/5 py-3 rounded-lg font-bold font-sans uppercase tracking-wider text-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif text-lg font-bold text-gold tracking-wide">Edit Lead Status</h3>
              <p className="text-xs text-foreground/50 font-sans mt-0.5">Client: {selectedLead.full_name}</p>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1.5 font-sans">Status Pipeline State</label>
              <select
                value={editStatusValue}
                onChange={(e) => setEditStatusValue(e.target.value as Lead["status"])}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-gold font-sans"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2 font-sans">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-gold hover:bg-gold-hover text-forest-950 py-3 rounded-lg font-bold uppercase tracking-wider text-xs shadow"
              >
                Update Status
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 bg-transparent border border-border text-foreground hover:bg-white/5 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirmOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-foreground tracking-wide">Delete Lead Reservation?</h3>
            </div>
            
            <p className="text-xs text-foreground/70 leading-relaxed font-sans">
              Are you sure you want to delete the booking query from <strong className="text-foreground">{selectedLead.full_name}</strong>? This action will permanently remove the record and cannot be undone.
            </p>

            <div className="flex gap-3 pt-2 font-sans">
              <button
                onClick={handleDeleteLead}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider text-xs shadow"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 bg-transparent border border-border text-foreground hover:bg-white/5 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Keep Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-left">
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold text-gold tracking-wide">Add New Booking Lead</h3>
              <p className="text-xs text-foreground/50 font-sans mt-0.5">Register a manual phone booking inquiry.</p>
            </div>

            <div className="h-[1px] w-full bg-border"></div>

            <form onSubmit={handleAddLead} className="space-y-4 text-sm font-sans">
              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Client full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Alt Contact (Opt)</label>
                  <input
                    type="text"
                    placeholder="Alternate number"
                    value={newAltPhone}
                    onChange={(e) => setNewAltPhone(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Service Type *</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                  >
                    {SERVICE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Guests *</label>
                  <input
                    type="number"
                    min={1}
                    value={newGuests}
                    onChange={(e) => setNewGuests(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Travel Date *</label>
                <input
                  type="date"
                  required
                  value={newTravelDate}
                  onChange={(e) => setNewTravelDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Special Notes</label>
                <textarea
                  rows={2}
                  placeholder="Any dietary needs, bed decoration, airport drop coordinates..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gold hover:bg-gold-hover text-forest-950 py-3 rounded-lg font-bold uppercase tracking-wider text-xs shadow border border-gold"
                >
                  Create Lead
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 bg-transparent border border-border text-foreground hover:bg-white/5 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
