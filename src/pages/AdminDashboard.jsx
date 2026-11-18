import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { AccessDenied } from "../components/AccessDenied";
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  PieChart, 
  BarChart2, 
  Search, 
  Filter, 
  Check, 
  X, 
  Layers, 
  Settings, 
  Zap,
  Activity,
  Award,
  ArrowUpRight
} from "lucide-react";

export const AdminDashboard = ({ onNavigateHome, onNavigateLogin }) => {
  const { currentUser, isAdmin } = useAuth();
  const { 
    services, 
    providers, 
    bookings, 
    users, 
    setProviderVerification, 
    toggleUserActiveState, 
    updateBookingStatus 
  } = useBooking();
  const { showToast } = useNotifications();

  // Tabs: overview, users, providers, bookings, services, analytics
  const [activeTab, setActiveTab] = useState("overview");

  // Booking tab status filter
  const [bookingFilter, setBookingFilter] = useState("All");
  const [userSearch, setUserSearch] = useState("");

  // STRICT ACCESS CONTROL: role: admin only
  if (!isAdmin) {
    return (
      <AccessDenied
        requiredRole="Admin (admin@smartserve.com)"
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />
    );
  }

  // --- STATS COMPUTATION ---
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== "Cancelled")
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  }, [bookings]);

  const platformNetCommission = useMemo(() => {
    return bookings
      .filter(b => b.status !== "Cancelled")
      .reduce((sum, b) => sum + (Number(b.platformFee) || Math.round(Number(b.totalAmount) * 0.05)), 0);
  }, [bookings]);

  const activeProvidersCount = useMemo(() => {
    return providers.filter(p => p.isVerified).length;
  }, [providers]);

  const pendingProviders = useMemo(() => {
    return providers.filter(p => !p.isVerified);
  }, [providers]);

  const customerUsersCount = useMemo(() => {
    return users.filter(u => u.role !== "admin").length;
  }, [users]);

  // Handle Provider Verification
  const handleVerifyProvider = async (providerId, approve) => {
    try {
      await setProviderVerification(providerId, approve);
      showToast({
        title: approve ? "Provider Approved" : "Provider Rejected",
        message: approve ? "Provider profile is now live and accepting customer slots." : "Application rejected.",
        type: approve ? "success" : "warn"
      });
    } catch (e) {
      showToast({ title: "Error", message: "Failed to update provider status.", type: "danger" });
    }
  };

  // Handle User Active Toggle
  const handleToggleUser = async (userId, currentName) => {
    try {
      await toggleUserActiveState(userId);
      showToast({
        title: "User Status Toggled",
        message: `Updated account state for ${currentName}.`,
        type: "info"
      });
    } catch (e) {
      showToast({ title: "Error", message: "Failed to toggle user status.", type: "danger" });
    }
  };

  // 6-Month Booking Trends Data (Mocked realistic curve aligned with seed)
  const monthlyTrends = [
    { month: "Jun", count: 48, revenue: 38400 },
    { month: "Jul", count: 72, revenue: 59200 },
    { month: "Aug", count: 110, revenue: 92400 },
    { month: "Sep", count: 154, revenue: 126000 },
    { month: "Oct", count: 210, revenue: 178500 },
    { month: "Nov", count: bookings.length + 240, revenue: totalRevenue + 195000 }
  ];
  const maxTrendCount = Math.max(...monthlyTrends.map(m => m.count));

  // Service Breakdown for Donut / Bars
  const serviceStats = useMemo(() => {
    return services.map(s => {
      const sBookings = bookings.filter(b => b.serviceId === s.id || b.serviceTitle === s.title);
      const rev = sBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0) + (s.pricePerHour * 8);
      return {
        id: s.id,
        title: s.title,
        count: sBookings.length + (s.popular ? 45 : 20),
        revenue: rev
      };
    });
  }, [services, bookings]);

  const maxServiceRev = Math.max(...serviceStats.map(s => s.revenue), 1000);

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "All") return bookings;
    return bookings.filter(b => b.status?.toLowerCase() === bookingFilter.toLowerCase());
  }, [bookings, bookingFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white shadow-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-rose-500">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-inner">
            <Settings className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/70 border border-rose-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                Admin Root Privilege
              </span>
              <span className="text-[10px] font-mono text-slate-400">admin@smartserve.com</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1">
              SmartServe Platform Control
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Live monitoring of users, provider credentials, escrow finances, and dispatch workflows.
            </p>
          </div>
        </div>

        {/* Quick KPI badge */}
        <div className="flex items-center gap-4 text-right">
          <div className="p-3 bg-navy-800/80 rounded-2xl border border-navy-700">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Gross GMV</span>
            <span className="text-xl font-heading font-extrabold text-gold">₹{totalRevenue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar bg-white p-2 rounded-2xl border border-slate-100 shadow-subtle">
        {[
          { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
          { id: "users", label: `Users (${users.length})`, icon: <Users className="w-4 h-4" /> },
          { id: "providers", label: `Providers (${providers.length})`, icon: <Briefcase className="w-4 h-4" /> },
          { id: "bookings", label: `Bookings (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: "services", label: `Services (${services.length})`, icon: <Layers className="w-4 h-4" /> },
          { id: "analytics", label: "Analytics & KPIs", icon: <TrendingUp className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Revenue</span>
                <p className="text-2xl font-heading font-extrabold text-navy">₹{totalRevenue.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +18.4% this month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings</span>
                <p className="text-2xl font-heading font-extrabold text-navy">{bookings.length + 650}</p>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {bookings.filter(b => b.status === "Confirmed").length} active today
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Active Providers</span>
                <p className="text-2xl font-heading font-extrabold text-navy">{activeProvidersCount}</p>
                <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                  {pendingProviders.length} pending verification
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Platform Users</span>
                <p className="text-2xl font-heading font-extrabold text-navy">{users.length + 1200}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                  99.8% active accounts
                </span>
              </div>
            </div>

          </div>

          {/* 2 CHARTS: BAR CHART (6-MONTH TRENDS) & DONUT CHART (BY SERVICE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 6-Month Bar Chart */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-heading font-extrabold text-navy">
                    Booking Trends (Last 6 Months)
                  </h3>
                  <p className="text-xs text-slate-400">Monthly completed job volume</p>
                </div>
                <BarChart2 className="w-5 h-5 text-gold" />
              </div>

              {/* Responsive SVG / CSS Bar Chart */}
              <div className="pt-6 pb-2">
                <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-slate-200">
                  {monthlyTrends.map((trend) => {
                    const heightPercent = Math.max(15, Math.round((trend.count / maxTrendCount) * 100));
                    return (
                      <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-mono font-bold text-navy opacity-0 group-hover:opacity-100 transition-opacity">
                          {trend.count}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-navy to-navy-600 group-hover:from-gold group-hover:to-gold-400 transition-all duration-300 relative shadow-sm"
                        />
                        <span className="text-xs font-bold text-slate-500 mt-1">{trend.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Service Breakdown Donut Chart */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-heading font-extrabold text-navy">
                    Service Demand Share
                  </h3>
                  <p className="text-xs text-slate-400">Distribution by booking category</p>
                </div>
                <PieChart className="w-5 h-5 text-gold" />
              </div>

              <div className="space-y-3.5">
                {serviceStats.map((item, idx) => {
                  const colors = [
                    "bg-navy text-navy", 
                    "bg-gold text-gold", 
                    "bg-blue-600 text-blue-600", 
                    "bg-emerald-600 text-emerald-600", 
                    "bg-purple-600 text-purple-600", 
                    "bg-rose-600 text-rose-600"
                  ];
                  const color = colors[idx % colors.length];

                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${color.split(" ")[0]}`} />
                          {item.title}
                        </span>
                        <span className="font-mono font-bold text-navy">{item.count} orders</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.round((item.count / 300) * 100))}%` }}
                          className={`h-full rounded-full ${color.split(" ")[0]}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* TWO LISTS: RECENT BOOKINGS & PENDING VERIFICATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Recent Bookings List */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-heading font-extrabold text-navy">
                  Recent Platform Bookings
                </h3>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-navy hover:text-gold"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id || b.bookingId}
                    className="p-3.5 rounded-2xl bg-surface border border-slate-200/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-navy">{b.bookingId}</span>
                        <span className="font-semibold text-slate-700">• {b.serviceTitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Cust: {b.customerName} • Pro: {b.providerName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-navy block">₹{b.totalAmount}</span>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                        b.status === "Completed" ? "bg-blue-100 text-blue-800" :
                        b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Verifications List */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-heading font-extrabold text-navy">
                  Pending Verifications
                </h3>
                <span className="text-xs font-bold bg-amber-50 text-gold px-2.5 py-0.5 rounded-full">
                  {pendingProviders.length} Pending
                </span>
              </div>

              {pendingProviders.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-semibold">All service providers are fully verified!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProviders.map((prov) => (
                    <div
                      key={prov.id}
                      className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prov.avatar}
                          alt={prov.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-navy truncate">{prov.name}</p>
                          <p className="text-[10px] text-slate-500">{prov.roleTitle}</p>
                          <span className="text-[10px] font-mono text-slate-400">{prov.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-amber-200/50">
                        <button
                          onClick={() => handleVerifyProvider(prov.id, true)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Verify & Approve
                        </button>
                        <button
                          onClick={() => handleVerifyProvider(prov.id, false)}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: USERS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-navy">Users Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Toggle active accounts or search registered customers</p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-slate-200 text-xs font-medium outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => {
                  const isActive = u.isActive !== false;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-navy block">{u.name || "Customer"}</span>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "admin" ? "bg-rose-100 text-rose-800" :
                          u.role === "provider" ? "bg-amber-100 text-amber-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {u.role || "customer"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{u.phone || "—"}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-500" title={u.address}>{u.address || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isActive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => handleToggleUser(u.id, u.name)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              isActive
                                ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PROVIDERS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "providers" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Registered</span>
              <p className="text-3xl font-heading font-extrabold text-navy mt-1">{providers.length}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle">
              <span className="text-[10px] font-bold uppercase text-slate-400">Verified & Active</span>
              <p className="text-3xl font-heading font-extrabold text-emerald-600 mt-1">{activeProvidersCount}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pending Review</span>
              <p className="text-3xl font-heading font-extrabold text-amber-600 mt-1">{pendingProviders.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
            <h2 className="text-xl font-heading font-extrabold text-navy border-b border-slate-100 pb-4">
              All Service Professionals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all bg-surface/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {p.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-navy text-sm">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.roleTitle}</p>
                    <p className="text-xs font-mono font-bold text-navy mt-1">₹{p.hourlyRate}/hour</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>{p.totalJobs} Jobs</span>
                    <span className="text-gold font-bold">★ {p.avgRating}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {p.isVerified ? (
                      <button
                        onClick={() => handleVerifyProvider(p.id, false)}
                        className="w-full py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all"
                      >
                        Revoke Verification
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerifyProvider(p.id, true)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Verify Provider
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: BOOKINGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-navy">All Bookings Master Table</h2>
              <p className="text-xs text-slate-500 mt-0.5">Filter by status or review schedule details</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["All", "Confirmed", "In Progress", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBookingFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingFilter === tab ? "bg-navy text-white shadow-sm" : "bg-surface text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b.id || b.bookingId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">{b.bookingId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{b.serviceTitle}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-navy block">{b.customerName}</span>
                      <span className="text-[10px] text-slate-400">{b.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{b.providerName}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 block">{b.scheduledDate}</span>
                      <span className="text-[10px] text-slate-400">{b.scheduledTime}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-navy">₹{b.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === "Completed" ? "bg-blue-100 text-blue-800" :
                        b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                        b.status === "In Progress" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: SERVICES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "services" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-heading font-extrabold text-navy">
              Services Revenue & Bookings Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Horizontal performance metrics for all 6 catalog categories
            </p>
          </div>

          <div className="space-y-6">
            {serviceStats.map((srv) => (
              <div key={srv.id} className="p-5 rounded-2xl bg-surface border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-heading font-bold text-navy text-sm">{srv.title}</h3>
                    <span className="text-[11px] text-slate-500">{srv.count} total bookings recorded</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-navy text-base">₹{srv.revenue.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400 block">cumulative volume</span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.round((srv.revenue / maxServiceRev) * 100))}%` }}
                    className="h-full bg-navy rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: ANALYTICS & KPIS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "analytics" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 3 KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Average Order Value (AOV)
              </span>
              <p className="text-3xl font-heading font-extrabold text-navy">
                ₹845
              </p>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8.2% from peak hour surcharges
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer Retention Rate
              </span>
              <p className="text-3xl font-heading font-extrabold text-navy">
                87.4%
              </p>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Repeat bookings within 45 days
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Platform Net Commission (5%)
              </span>
              <p className="text-3xl font-heading font-extrabold text-gold">
                ₹{platformNetCommission.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Escrow fees retained for quality guarantee
              </p>
            </div>

          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
            <h3 className="text-base font-heading font-extrabold text-navy">
              Quality Assurance & Compliance Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-surface border border-slate-200/50">
                <p className="font-bold text-slate-500">On-Time Arrival</p>
                <p className="text-xl font-heading font-extrabold text-navy mt-1">98.2%</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-slate-200/50">
                <p className="font-bold text-slate-500">Escrow Dispute Rate</p>
                <p className="text-xl font-heading font-extrabold text-emerald-600 mt-1">0.14%</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-slate-200/50">
                <p className="font-bold text-slate-500">Avg Review Score</p>
                <p className="text-xl font-heading font-extrabold text-gold mt-1">4.89 / 5.0</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
