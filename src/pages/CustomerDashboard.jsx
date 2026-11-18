import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  CreditCard, 
  Star, 
  Award, 
  Zap, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";

export const CustomerDashboard = ({ onNavigateServices, onNavigateBookings }) => {
  const { currentUser, updateProfile } = useAuth();
  const { bookings, reviews } = useBooking();
  const { showToast } = useNotifications();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "+91 99887 66554",
    address: currentUser?.address || "Flat 402, Green Glen Heights, Bellandur, Bengaluru, Karnataka 560103"
  });
  const [saving, setSaving] = useState(false);

  // Sync when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "+91 99887 66554",
        address: currentUser.address || ""
      });
    }
  }, [currentUser]);

  // My Bookings
  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    const myId = currentUser.id || currentUser.uid;
    const myEmail = currentUser.email;
    return bookings.filter(b => b.customerId === myId || b.customerEmail === myEmail);
  }, [bookings, currentUser]);

  // My Reviews
  const myReviews = useMemo(() => {
    if (!currentUser) return [];
    const myId = currentUser.id || currentUser.uid;
    return reviews.filter(r => r.customerId === myId);
  }, [reviews, currentUser]);

  // Stats calculation
  const totalBookings = myBookings.length;
  const completedBookings = myBookings.filter(b => b.status === "Completed").length;
  const totalSpent = myBookings
    .filter(b => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  
  const avgRatingGiven = myReviews.length > 0
    ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
    : "5.0";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });
      setIsEditing(false);
      showToast({
        title: "Profile Updated",
        message: "Your profile details have been saved to Firestore.",
        type: "success"
      });
    } catch (err) {
      showToast({
        title: "Update Error",
        message: "Failed to save profile changes. Please try again.",
        type: "danger"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-800 to-navy rounded-3xl p-6 sm:p-8 text-white shadow-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center font-heading font-extrabold text-2xl text-gold shadow-inner">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-0.5 rounded-full">
              Customer Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1">
              Welcome back, {currentUser?.name || "Customer"}!
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Managing services for {formData.address ? formData.address.split(",")[0] : "your home"}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateServices}
          className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-600 text-navy font-heading font-extrabold text-xs shadow-md transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <Zap className="w-4 h-4 fill-navy" />
          <span>Book New Service</span>
        </button>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{totalBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Completed</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{completedBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Spent</span>
            <p className="text-2xl font-heading font-extrabold text-navy">₹{totalSpent.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Avg Rating Given</span>
            <p className="text-2xl font-heading font-extrabold text-navy">{avgRatingGiven} ★</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 7 COLS: RECENT ACTIVITY FROM FIRESTORE */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-heading font-extrabold text-navy">Recent Activity</h2>
              <p className="text-xs text-slate-400">Real-time appointments and past logs</p>
            </div>
            <button
              onClick={onNavigateBookings}
              className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No recent bookings recorded.</p>
              <button
                onClick={onNavigateServices}
                className="mt-3 text-xs font-bold text-gold hover:underline"
              >
                Schedule your first service →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.slice(0, 5).map((b) => (
                <div
                  key={b.id || b.bookingId}
                  className="p-4 rounded-2xl bg-surface border border-slate-200/60 flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {b.serviceTitle?.slice(0, 2).toUpperCase() || "SS"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-navy truncate">{b.serviceTitle}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.scheduledDate} • {b.scheduledTime} • {b.providerName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-extrabold text-navy block font-mono">₹{b.totalAmount}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      b.status === "Completed" ? "bg-blue-100 text-blue-800" :
                      b.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" :
                      b.status === "In Progress" ? "bg-amber-100 text-amber-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: EDITABLE PROFILE PANEL */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-heading font-extrabold text-navy">Profile Details</h2>
              <p className="text-xs text-slate-400">Saved customer address & contact</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-navy hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-gold" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-navy hover:bg-navy-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-gold" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* VIEW DETAILS */
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-surface border border-slate-200/60 flex items-center gap-3">
                <User className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Name</span>
                  <p className="font-bold text-navy">{formData.name || "Customer"}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface border border-slate-200/60 flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Email</span>
                  <p className="font-semibold text-slate-700">{formData.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface border border-slate-200/60 flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone</span>
                  <p className="font-semibold text-slate-700">{formData.phone}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface border border-slate-200/60 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Default Address</span>
                  <p className="font-semibold text-slate-700 leading-relaxed">{formData.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
