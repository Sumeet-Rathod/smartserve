import React, { useState } from "react";
import { StarRating } from "./StarRating";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { X, Send, Award, Sparkles } from "lucide-react";

export const ReviewModal = ({ booking, isOpen, onClose }) => {
  const { addReview } = useBooking();
  const { showToast } = useNotifications();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast({
        title: "Review Required",
        message: "Please write a few words about your experience with the service provider.",
        type: "warn"
      });
      return;
    }

    setSubmitting(true);
    try {
      await addReview({
        bookingId: booking.bookingId || booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName,
        providerId: booking.providerId,
        rating,
        comment
      });

      showToast({
        title: "Review Submitted!",
        message: `Thank you for rating ${booking.providerName}. Your feedback helps our community flourish.`,
        type: "success"
      });

      onClose();
    } catch (err) {
      showToast({
        title: "Submission Error",
        message: "Failed to save your review. Please try again.",
        type: "danger"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-gold flex items-center justify-center border border-amber-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Leave Service Review</span>
            <h2 className="text-xl font-heading font-extrabold text-navy">
              Rate your experience
            </h2>
          </div>
        </div>

        <div className="bg-[#F4F6FB] rounded-2xl p-4 mb-6 text-sm flex items-center justify-between border border-slate-200/60">
          <div>
            <p className="font-bold text-navy">{booking.serviceTitle}</p>
            <p className="text-xs text-slate-500">Provider: <span className="font-semibold text-slate-700">{booking.providerName}</span></p>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-600">
            {booking.bookingId}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
                size="lg"
              />
              <span className="text-sm font-bold text-navy ml-2">
                {rating === 5 ? "Outstanding ⭐️⭐️⭐️⭐️⭐️" : rating === 4 ? "Very Good ⭐️⭐️⭐️⭐️" : rating === 3 ? "Average ⭐️⭐️⭐️" : rating === 2 ? "Below Average" : "Needs Improvement"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Your Review & Comments
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the punctuality, cleanliness, craftsmanship, and communication?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-800 text-white text-sm font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-gold" />
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
