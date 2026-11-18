import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { ReviewModal } from "../components/ReviewModal";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Award, 
  Wrench, 
  Sparkles, 
  Laptop, 
  Trees, 
  Paintbrush, 
  Truck, 
  AlertCircle,
  XCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export const MyBookingsPage = ({ onNavigateServices }) => {
  const { currentUser } = useAuth();
  const { bookings, updateBookingStatus } = useBooking();
  const { showToast } = useNotifications();

  const [statusFilter, setStatusFilter] = useState("All");
  const [reviewBooking, setReviewBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Filter bookings for current logged in customer
  const customerBookings = useMemo(() => {
    if (!currentUser) return [];
    const myId = currentUser.id || currentUser.uid;
    const myEmail = currentUser.email;

    return bookings.filter(b => 
      b.customerId === myId || b.customerEmail === myEmail || (!b.customerId && b.customerEmail === myEmail)
    );
  }, [bookings, currentUser]);

  const filteredBookings = useMemo(() => {
    if (statusFilter === "All") return customerBookings;
    return customerBookings.filter(b => b.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [customerBookings, statusFilter]);

  const getServiceIcon = (iconName) => {
    const props = { className: "w-5 h-5 text-gold" };
    switch (iconName) {
      case "Wrench": return <Wrench {...props} />;
      case "Sparkles": return <Sparkles {...props} />;
      case "Laptop": return <Laptop {...props} />;
      case "Trees": return <Trees {...props} />;
      case "Paintbrush": return <Paintbrush {...props} />;
      case "Truck": return <Truck {...props} />;
      default: return <Wrench {...props} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Confirmed
          </span>
        );
      case "In Progress":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            In Progress
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      await updateBookingStatus(bookingId, "Cancelled");
      showToast({
        title: "Booking Cancelled",
        message: "Your booking has been cancelled with zero penalty.",
        type: "warn"
      });
    } catch (e) {
      showToast({
        title: "Cancellation Error",
        message: "Failed to cancel booking. Please try again.",
        type: "danger"
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Review Modal */}
      <ReviewModal
        booking={reviewBooking}
        isOpen={Boolean(reviewBooking)}
        onClose={() => setReviewBooking(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/15 px-3 py-1 rounded-full">
            Real-Time Records
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-navy mt-1">
            My Service Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track appointments, review past services, and manage ongoing work orders.
          </p>
        </div>

        <button
          onClick={onNavigateServices}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <span>Book Another Service</span>
          <ArrowRight className="w-4 h-4 text-gold" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar bg-white p-2 rounded-2xl border border-slate-100 shadow-subtle">
        {["All", "Confirmed", "In Progress", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === tab
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
            {tab === "All" && ` (${customerBookings.length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-subtle max-w-md mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-heading font-bold text-navy">No bookings found</h3>
          <p className="text-xs text-slate-500">
            {statusFilter === "All" 
              ? "You haven't booked any services yet. Explore our verified catalog to get started!"
              : `You have no bookings currently in '${statusFilter}' status.`}
          </p>
          <button
            onClick={onNavigateServices}
            className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-600 text-navy font-heading font-extrabold text-xs shadow-md transition-all"
          >
            Browse Verified Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id || b.bookingId}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  {getServiceIcon(b.serviceIcon)}
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {b.bookingId}
                    </span>
                    <h3 className="text-base font-heading font-bold text-navy">
                      {b.serviceTitle}
                    </h3>
                    {getStatusBadge(b.status)}
                  </div>

                  <p className="text-xs text-slate-600">
                    Assigned Pro: <strong className="text-navy">{b.providerName}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-navy" />
                      {b.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {b.scheduledTime} ({b.hours} hrs)
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.address}
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-surface p-2 rounded-xl border border-slate-200/50">
                      Note: "{b.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side: Total Amount & Action Buttons */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Amount</span>
                  <p className="text-2xl font-heading font-extrabold text-navy">
                    ₹{b.totalAmount}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Leave Review Button for Completed Bookings */}
                  {b.status === "Completed" && (
                    b.hasReview ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-gold border border-amber-200 text-xs font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Reviewed ★
                      </span>
                    ) : (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-600 text-navy font-heading font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Star className="w-3.5 h-3.5 fill-navy" />
                        Leave Review
                      </button>
                    )
                  )}

                  {/* Cancel Button if Confirmed */}
                  {b.status === "Confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(b.id || b.bookingId)}
                      disabled={cancellingId === (b.id || b.bookingId)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {cancellingId === (b.id || b.bookingId) ? "Cancelling..." : "Cancel Slot"}
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
