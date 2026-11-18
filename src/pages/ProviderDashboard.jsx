import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { AccessDenied } from "../components/AccessDenied";
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  UserCheck, 
  Phone, 
  Mail, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  X,
  PlayCircle
} from "lucide-react";

export const ProviderDashboard = ({ onNavigateHome, onNavigateLogin }) => {
  const { currentUser, isProvider } = useAuth();
  const { providers, bookings, reviews, updateBookingStatus, updateProviderAvailability } = useBooking();
  const { showToast } = useNotifications();

  // Find provider record in Firestore
  const myProvider = useMemo(() => {
    if (!currentUser) return null;
    return providers.find(
      p => p.userId === currentUser.id || p.userId === currentUser.uid || p.email === currentUser.email
    ) || providers[0]; // fallback to Rajesh Kumar if demo
  }, [providers, currentUser]);

  // Assigned Bookings
  const assignedBookings = useMemo(() => {
    if (!myProvider) return [];
    return bookings.filter(b => b.providerId === myProvider.id || b.providerName === myProvider.name);
  }, [bookings, myProvider]);

  // Availability schedule state (Mon-Sun)
  const defaultAvailability = {
    Mon: { active: true, start: "08:00", end: "18:00" },
    Tue: { active: true, start: "08:00", end: "18:00" },
    Wed: { active: true, start: "08:00", end: "18:00" },
    Thu: { active: true, start: "08:00", end: "18:00" },
    Fri: { active: true, start: "08:00", end: "18:00" },
    Sat: { active: true, start: "08:00", end: "18:00" },
    Sun: { active: false, start: "09:00", end: "17:00" }
  };

  const [availability, setAvailability] = useState(myProvider?.availability || defaultAvailability);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Sync availability when provider loads
  React.useEffect(() => {
    if (myProvider?.availability) {
      setAvailability(myProvider.availability);
    }
  }, [myProvider]);

  // Provider Stats
  const totalJobs = myProvider?.totalJobs || assignedBookings.length;
  const completedJobs = assignedBookings.filter(b => b.status === "Completed").length;
  const thisMonthJobs = assignedBookings.filter(b => b.status !== "Cancelled").length;
  const totalEarned = assignedBookings
    .filter(b => b.status === "Completed")
    .reduce((sum, b) => sum + (Number(b.baseAmount) || (Number(b.totalAmount) * 0.9)), 0);
  const avgRating = myProvider?.avgRating || "4.9";

  // Role Gate Enforcement
  if (!isProvider) {
    return (
      <AccessDenied
        requiredRole="Provider"
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />
    );
  }

  // Handle Booking Status Update by Provider
  const handleStatusChange = async (bookingId, nextStatus) => {
    try {
      await updateBookingStatus(bookingId, nextStatus);
      showToast({
        title: "Status Updated",
        message: `Booking has been moved to '${nextStatus}'.`,
        type: "success"
      });
    } catch (e) {
      showToast({
        title: "Error",
        message: "Failed to update booking status.",
        type: "danger"
      });
    }
  };

  // Toggle Day Active
  const handleToggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day]?.active
      }
    }));
  };

  // Update Day Hours
  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Save Schedule to Firestore
  const handleSaveAvailability = async () => {
    if (!myProvider) return;
    setSavingSchedule(true);
    try {
      await updateProviderAvailability(myProvider.id, availability);
      showToast({
        title: "Schedule Saved",
        message: "Your weekly availability is updated in Firestore and active for customer bookings.",
        type: "success"
      });
    } catch (err) {
      showToast({
        title: "Save Failed",
        message: "Failed to persist availability schedule.",
        type: "danger"
      });
    } finally {
      setSavingSchedule(false);
    }
  };

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Provider Hero Header */}
      <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white shadow-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={myProvider?.avatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80"}
            alt={myProvider?.name}
            className="w-18 h-18 rounded-2xl object-cover border-2 border-gold/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2.5 py-0.5 rounded-full">
                Service Professional
              </span>
              {myProvider?.isVerified && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1">
              {myProvider?.name || currentUser?.name}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {myProvider?.roleTitle || "Master Service Technician"} • Base: ₹{myProvider?.hourlyRate || 320}/hr
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-stretch md:self-auto justify-between md:justify-end">
          <div className="p-3 bg-navy-800/80 rounded-2xl border border-navy-700 text-center px-4">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Rating</span>
            <span className="text-lg font-heading font-extrabold text-gold">{avgRating} ★</span>
          </div>
          <div className="p-3 bg-navy-800/80 rounded-2xl border border-navy-700 text-center px-4">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Jobs Done</span>
            <span className="text-lg font-heading font-extrabold text-white">{totalJobs}</span>
          </div>
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Jobs</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{totalJobs}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">This Month</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{thisMonthJobs}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Earned</span>
            <p className="text-2xl font-heading font-extrabold text-navy">₹{Math.round(totalEarned).toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Avg Rating</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{avgRating} ★</p>
          </div>
        </div>

      </div>

      {/* ASSIGNED BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-navy">
              Assigned Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live customer orders scheduled for you in Firestore
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-50 text-gold px-3 py-1 rounded-full border border-amber-200">
            {assignedBookings.length} Assignments
          </span>
        </div>

        {assignedBookings.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No active job assignments found.</p>
            <p className="text-xs text-slate-400 mt-1">New customer bookings will appear here instantly in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Earnings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {assignedBookings.map((b) => (
                  <tr key={b.id || b.bookingId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">
                      {b.bookingId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-navy">{b.serviceTitle}</span>
                      <span className="text-[10px] text-slate-400 block">{b.hours} hrs</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{b.customerName}</span>
                      <span className="text-[10px] text-slate-400 block">{b.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{b.scheduledDate}</span>
                      <span className="text-[10px] text-slate-400 block">{b.scheduledTime}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={b.address}>
                      {b.address}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-navy">
                      ₹{b.baseAmount || Math.round(b.totalAmount * 0.9)}
                    </td>
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "Confirmed" && (
                          <button
                            onClick={() => handleStatusChange(b.id || b.bookingId, "In Progress")}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] transition-all flex items-center gap-1"
                          >
                            <PlayCircle className="w-3 h-3" />
                            Start Job
                          </button>
                        )}
                        {b.status === "In Progress" && (
                          <button
                            onClick={() => handleStatusChange(b.id || b.bookingId, "Completed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                          </button>
                        )}
                        {b.status !== "Completed" && b.status !== "Cancelled" && (
                          <button
                            onClick={() => handleStatusChange(b.id || b.bookingId, "Cancelled")}
                            className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[10px] transition-all"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 7 COLS: MY AVAILABILITY SCHEDULE (DAYS + HOURS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-navy">
                My Weekly Availability
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set active working days and custom hours. Customers can only book slots within this window.
              </p>
            </div>
            <button
              onClick={handleSaveAvailability}
              disabled={savingSchedule}
              className="px-4 py-2 rounded-xl bg-navy hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              {savingSchedule ? "Saving..." : "Save Schedule"}
            </button>
          </div>

          <div className="space-y-3">
            {daysList.map((day) => {
              const sched = availability[day] || { active: true, start: "08:00", end: "18:00" };

              return (
                <div
                  key={day}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    sched.active
                      ? "bg-emerald-50/30 border-emerald-200"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                        sched.active ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                    <div>
                      <span className="font-heading font-extrabold text-sm text-navy">{day}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {sched.active ? "Open for bookings" : "Day Off (No customer slots)"}
                      </span>
                    </div>
                  </div>

                  {sched.active ? (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">From:</span>
                        <input
                          type="time"
                          value={sched.start}
                          onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold text-navy outline-none"
                        />
                      </div>
                      <span className="text-slate-400">to</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">To:</span>
                        <input
                          type="time"
                          value={sched.end}
                          onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold text-navy outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1 bg-slate-200 rounded-lg">
                      Day Off
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 5 COLS: MY PROFILE SECTION */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-heading font-extrabold text-navy">
              My Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Service capabilities and rate card
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Services</span>
              <p className="font-bold text-navy text-sm mt-0.5">
                {myProvider?.services?.join(", ") || "Home Repair, Interior Painting"}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Hourly Rate Charged</span>
              <p className="font-heading font-extrabold text-navy text-xl mt-0.5">
                ₹{myProvider?.hourlyRate || 320}/hour
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Bio & Qualifications</span>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {myProvider?.bio || "Certified technician with comprehensive multi-year experience."}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-gold" />
                <span>{myProvider?.phone || "+91 98111 22334"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-gold" />
                <span>{myProvider?.email || currentUser?.email}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
