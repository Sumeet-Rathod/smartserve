import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// Check if a time string falls into Peak hours: 9am-12pm or 4pm-7pm
export const isPeakSlot = (timeString) => {
  if (!timeString) return false;
  // Format examples: "09:00 AM", "11:30 AM", "04:00 PM", "06:30 PM"
  const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  // 9:00 AM to 12:00 PM (hour 9, 10, 11)
  const isMorningPeak = hour >= 9 && hour < 12;
  // 4:00 PM to 7:00 PM (hour 16, 17, 18)
  const isEveningPeak = hour >= 16 && hour < 19;

  return isMorningPeak || isEveningPeak;
};

// Pricing calculation utility function
export const calculateBookingPrice = ({ hourlyRate, hours, timeSlot, dateString }) => {
  const base = (Number(hourlyRate) || 0) * (Number(hours) || 1);
  const isPeak = isPeakSlot(timeSlot);

  // Check weekend
  let isWeekend = false;
  let isToday = false;

  if (dateString) {
    const bookingDate = new Date(dateString + "T00:00:00");
    const day = bookingDate.getDay();
    isWeekend = day === 0 || day === 6; // Sunday or Saturday

    const todayStr = new Date().toISOString().split("T")[0];
    isToday = dateString === todayStr;
  }

  const peakSurcharge = isPeak ? Math.round(base * 0.25) : 0;
  const weekendSurcharge = isWeekend ? Math.round(base * 0.15) : 0;
  const expressSurcharge = isToday ? Math.round(base * 0.10) : 0;

  const subtotal = base + peakSurcharge + weekendSurcharge + expressSurcharge;
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + platformFee;

  return {
    base,
    hours: Number(hours) || 1,
    hourlyRate: Number(hourlyRate) || 0,
    isPeak,
    peakSurcharge,
    isWeekend,
    weekendSurcharge,
    isToday,
    expressSurcharge,
    subtotal,
    platformFee,
    total
  };
};

export const BookingProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore subscriptions for all 5 collections
  useEffect(() => {
    let unsubs = [];

    const unsubServices = db.onSnapshot("services", (snapshot) => {
      setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    unsubs.push(unsubServices);

    const unsubProviders = db.onSnapshot("providers", (snapshot) => {
      setProviders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    unsubs.push(unsubProviders);

    const unsubBookings = db.onSnapshot("bookings", (snapshot) => {
      const bks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by newest created
      bks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setBookings(bks);
    });
    unsubs.push(unsubBookings);

    const unsubReviews = db.onSnapshot("reviews", (snapshot) => {
      setReviews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    unsubs.push(unsubReviews);

    const unsubUsers = db.onSnapshot("users", (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    unsubs.push(unsubUsers);

    return () => {
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, []);

  // Create new booking in Firestore
  const createBooking = async (bookingPayload) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `BK-${randomNum}`;

    const newBooking = {
      ...bookingPayload,
      bookingId,
      status: "Confirmed",
      hasReview: false,
      createdAt: new Date().toISOString()
    };

    const saved = await db.addDoc("bookings", newBooking);

    // Increment provider's totalJobs
    if (bookingPayload.providerId) {
      const prov = providers.find(p => p.id === bookingPayload.providerId);
      if (prov) {
        await db.updateDoc("providers", prov.id, {
          totalJobs: (prov.totalJobs || 0) + 1
        });
      }
    }

    return saved;
  };

  // Update status (e.g. In Progress, Completed, Cancelled)
  const updateBookingStatus = async (bookingIdOrDocId, newStatus) => {
    const booking = bookings.find(b => b.id === bookingIdOrDocId || b.bookingId === bookingIdOrDocId);
    if (!booking) return null;

    const updated = await db.updateDoc("bookings", booking.id, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    return updated;
  };

  // Submit a customer review
  const addReview = async ({ bookingId, customerId, customerName, providerId, rating, comment }) => {
    const newRev = {
      bookingId,
      customerId,
      customerName: customerName || "SmartServe Customer",
      providerId,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    await db.addDoc("reviews", newRev);

    // Update booking record to mark hasReview = true
    const b = bookings.find(item => item.bookingId === bookingId || item.id === bookingId);
    if (b) {
      await db.updateDoc("bookings", b.id, { hasReview: true });
    }

    // Recalculate provider average rating
    const allProviderReviews = reviews.filter(r => r.providerId === providerId);
    const totalRatings = allProviderReviews.reduce((sum, r) => sum + r.rating, 0) + Number(rating);
    const newCount = allProviderReviews.length + 1;
    const newAvg = Number((totalRatings / newCount).toFixed(2));

    const prov = providers.find(p => p.id === providerId);
    if (prov) {
      await db.updateDoc("providers", prov.id, {
        avgRating: newAvg
      });
    }

    return newRev;
  };

  // Update provider availability schedule
  const updateProviderAvailability = async (providerId, newAvailability) => {
    const prov = providers.find(p => p.id === providerId || p.userId === providerId);
    if (!prov) return;
    return await db.updateDoc("providers", prov.id, {
      availability: newAvailability
    });
  };

  // Admin: verify or reject provider
  const setProviderVerification = async (providerId, isVerified) => {
    return await db.updateDoc("providers", providerId, { isVerified });
  };

  // Admin: toggle user active state
  const toggleUserActiveState = async (userId) => {
    const u = users.find(user => user.id === userId);
    if (!u) return;
    const nextState = u.isActive === false ? true : false;
    return await db.updateDoc("users", userId, { isActive: nextState });
  };

  // Admin: update service details
  const updateService = async (serviceId, updates) => {
    return await db.updateDoc("services", serviceId, updates);
  };

  const value = {
    services,
    providers,
    bookings,
    reviews,
    users,
    loading,
    createBooking,
    updateBookingStatus,
    addReview,
    updateProviderAvailability,
    setProviderVerification,
    toggleUserActiveState,
    updateService
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
