import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooking, isPeakSlot, calculateBookingPrice } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Info, 
  AlertCircle, 
  Sparkles, 
  Lightbulb, 
  UserCheck, 
  ChevronRight,
  Zap,
  Tag
} from "lucide-react";

export const BookingFlowPage = ({ initialService, onNavigateBookings, onNavigateAuth }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { services, providers, bookings, createBooking } = useBooking();
  const { showToast, addNotification } = useNotifications();

  // Current active step: 1 (Provider), 2 (Date & Time), 3 (Review & Confirm)
  const [currentStep, setCurrentStep] = useState(1);

  // Selected Service
  const [selectedService, setSelectedService] = useState(
    initialService || (services.length > 0 ? services[0] : null)
  );

  // Selected Provider
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Step 2 selections
  // Default date: tomorrow or today
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Step 3 inputs
  const [address, setAddress] = useState(currentUser?.address || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update duration when service changes
  useEffect(() => {
    if (selectedService) {
      setSelectedDuration(selectedService.minHours || 2);
    }
  }, [selectedService]);

  // Update address if user profile is ready
  useEffect(() => {
    if (currentUser?.address && !address) {
      setAddress(currentUser.address);
    }
  }, [currentUser, address]);

  // Filter verified providers for the chosen service
  const serviceProviders = useMemo(() => {
    if (!selectedService) return [];
    return providers.filter(
      p => p.isVerified && (p.services?.includes(selectedService.id) || p.services?.includes("all"))
    );
  }, [providers, selectedService]);

  // Auto-select first provider if none selected
  useEffect(() => {
    if (serviceProviders.length > 0 && !selectedProvider) {
      setSelectedProvider(serviceProviders[0]);
    }
  }, [serviceProviders, selectedProvider]);

  // Determine day of week from selected date: 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  const dayName = useMemo(() => {
    if (!selectedDate) return "Mon";
    const d = new Date(selectedDate + "T00:00:00");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[d.getDay()];
  }, [selectedDate]);

  // Provider schedule for selected day
  const providerDaySchedule = useMemo(() => {
    if (!selectedProvider || !selectedProvider.availability) return null;
    return selectedProvider.availability[dayName] || null;
  }, [selectedProvider, dayName]);

  // Generate available slots based on provider schedule and existing bookings
  const availableSlots = useMemo(() => {
    if (!providerDaySchedule || !providerDaySchedule.active) return [];

    const slots = [];
    const startHour = parseInt(providerDaySchedule.start.split(":")[0], 10);
    const endHour = parseInt(providerDaySchedule.end.split(":")[0], 10);
    
    // Check if selected date is today to filter past hours
    const now = new Date();
    const isToday = selectedDate === todayStr;
    const currentHour = now.getHours();

    // Check existing bookings on this date for this provider
    const existingBookedTimes = bookings
      .filter(b => b.providerId === selectedProvider.id && b.scheduledDate === selectedDate && b.status !== "Cancelled")
      .map(b => b.scheduledTime);

    for (let h = startHour; h < endHour; h++) {
      // If today and time has passed, skip
      if (isToday && h <= currentHour) continue;

      // Slot format
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const slotString = `${displayHour < 10 ? "0" + displayHour : displayHour}:00 ${period}`;

      // Check if slot overlaps with booked slot
      if (!existingBookedTimes.includes(slotString)) {
        slots.push({
          time: slotString,
          isPeak: isPeakSlot(slotString)
        });
      }
    }

    return slots;
  }, [providerDaySchedule, selectedDate, todayStr, bookings, selectedProvider]);

  // Auto-select first available slot if current slot isn't in list
  useEffect(() => {
    if (availableSlots.length > 0) {
      const exists = availableSlots.some(s => s.time === selectedTimeSlot);
      if (!exists) {
        setSelectedTimeSlot(availableSlots[0].time);
      }
    } else {
      setSelectedTimeSlot("");
    }
  }, [availableSlots, selectedTimeSlot]);

  // LIVE PRICING CALCULATION
  const priceBreakdown = useMemo(() => {
    const rate = selectedProvider?.hourlyRate || selectedService?.pricePerHour || 250;
    return calculateBookingPrice({
      hourlyRate: rate,
      hours: selectedDuration,
      timeSlot: selectedTimeSlot,
      dateString: selectedDate
    });
  }, [selectedProvider, selectedService, selectedDuration, selectedTimeSlot, selectedDate]);

  // Handler: Confirm Booking
  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      showToast({
        title: "Sign In Required",
        message: "Please sign in to confirm and save your booking.",
        type: "warn"
      });
      if (onNavigateAuth) onNavigateAuth();
      return;
    }

    if (!address.trim()) {
      showToast({
        title: "Address Required",
        message: "Please provide your service address before proceeding.",
        type: "warn"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        customerId: currentUser.id || currentUser.uid,
        customerName: currentUser.name || "Valued Customer",
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || "+91 99887 66554",
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        serviceIcon: selectedService.icon,
        scheduledDate: selectedDate,
        scheduledTime: selectedTimeSlot,
        hours: selectedDuration,
        hourlyRate: selectedProvider.hourlyRate,
        baseAmount: priceBreakdown.base,
        peakSurcharge: priceBreakdown.peakSurcharge,
        weekendSurcharge: priceBreakdown.weekendSurcharge,
        expressSurcharge: priceBreakdown.expressSurcharge,
        platformFee: priceBreakdown.platformFee,
        totalAmount: priceBreakdown.total,
        address: address.trim(),
        notes: notes.trim()
      };

      const created = await createBooking(bookingData);

      // Celebration Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      // 1. Toast notification slide-in from right: "Booking BK-XXXXX confirmed!"
      showToast({
        title: `Booking ${created.bookingId} confirmed!`,
        message: `Your slot for ${selectedService.title} on ${selectedDate} at ${selectedTimeSlot} is reserved.`,
        type: "booking"
      });

      // 2. Also add to notification bell list
      await addNotification({
        title: `Booking ${created.bookingId} Confirmed`,
        message: `${selectedService.title} with ${selectedProvider.name} is scheduled for ${selectedDate} at ${selectedTimeSlot}.`,
        type: "booking",
        userId: currentUser.id || currentUser.uid
      });

      // 3. After 2 seconds: second notification "Provider [name] has been notified"
      setTimeout(async () => {
        showToast({
          title: "Provider Alerted",
          message: `Provider ${selectedProvider.name} has been notified and will arrive with equipment.`,
          type: "info"
        });

        await addNotification({
          title: `Provider Notified`,
          message: `${selectedProvider.name} received your job dispatch details.`,
          type: "info",
          userId: currentUser.id || currentUser.uid
        });
      }, 2000);

      // 4. Redirect to My Bookings
      setTimeout(() => {
        if (onNavigateBookings) onNavigateBookings();
      }, 1500);

    } catch (err) {
      console.error(err);
      showToast({
        title: "Booking Failed",
        message: "An error occurred while confirming your reservation. Please try again.",
        type: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, prompt nicely
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-hover space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-gold flex items-center justify-center mx-auto border border-amber-200">
            <Zap className="w-8 h-8 fill-gold" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-navy">
            Sign in to Book {selectedService?.title || "a Service"}
          </h2>
          <p className="text-sm text-slate-600">
            Booking requests require a verified SmartServe account so providers can coordinate arrival and guarantee escrow coverage.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateAuth}
              className="w-full py-3.5 rounded-xl bg-navy hover:bg-navy-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Sign In / Sign Up</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Step Indicator Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/15 px-3 py-1 rounded-full">
              3-Step Guaranteed Booking
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-navy mt-1">
              Customize Your {selectedService?.title} Reservation
            </h1>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 sm:gap-4">
            {[
              { num: 1, label: "Choose Provider" },
              { num: 2, label: "Date & Time" },
              { num: 3, label: "Review & Pay" }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div 
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  className={`flex items-center gap-2 cursor-pointer ${
                    currentStep === step.num
                      ? "text-navy font-bold"
                      : currentStep > step.num
                      ? "text-emerald-600 font-semibold"
                      : "text-slate-400 font-medium"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
                      currentStep === step.num
                        ? "bg-navy text-gold shadow-sm ring-2 ring-gold/40"
                        : currentStep > step.num
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className="text-xs hidden md:inline">{step.label}</span>
                </div>
                {idx < 2 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 8 COLS: STEP CONTENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: CHOOSE PROVIDER */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-heading font-extrabold text-navy">
                  Step 1: Select Verified Service Professional
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All providers are identity-verified and follow strict SmartServe hygiene protocols.
                </p>
              </div>

              {serviceProviders.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <AlertCircle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm font-semibold">No verified providers found for this service category right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceProviders.map((prov) => {
                    const isSelected = selectedProvider?.id === prov.id;
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

                    return (
                      <div
                        key={prov.id}
                        onClick={() => setSelectedProvider(prov)}
                        className={`rounded-2xl p-5 border transition-all cursor-pointer relative ${
                          isSelected
                            ? "border-navy ring-2 ring-gold/40 bg-amber-50/20 shadow-md"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 bg-navy text-gold text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Selected
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <img
                            src={prov.avatar}
                            alt={prov.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-heading font-bold text-navy truncate">
                                {prov.name}
                              </h3>
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verified Pro
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {prov.roleTitle}
                            </p>

                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <div className="flex items-center gap-1 text-gold font-bold">
                                <Star className="w-3.5 h-3.5 fill-gold" />
                                <span>{prov.avgRating}</span>
                              </div>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-600 font-semibold">{prov.totalJobs} Jobs Completed</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-navy font-extrabold">₹{prov.hourlyRate}/hr</span>
                            </div>

                            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                              {prov.bio}
                            </p>
                          </div>
                        </div>

                        {/* Provider Availability Grid: Mon-Sun with hours or Day Off */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Weekly Working Hours & Days:
                          </p>
                          <div className="grid grid-cols-7 gap-1.5 text-center">
                            {days.map((d) => {
                              const sched = prov.availability?.[d];
                              const isActive = sched && sched.active;
                              return (
                                <div
                                  key={d}
                                  className={`p-2 rounded-xl border text-[11px] flex flex-col items-center justify-center ${
                                    isActive
                                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                                      : "bg-slate-100 border-slate-200 text-slate-400"
                                  }`}
                                >
                                  <span className="font-bold">{d}</span>
                                  <span className="text-[9px] mt-0.5">
                                    {isActive ? `${sched.start}-${sched.end}` : "Off"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!selectedProvider}
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-sm shadow-md flex items-center gap-2 group transition-all disabled:opacity-50"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE, DURATION & TIME SLOTS */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-navy">
                    Step 2: Choose Date, Duration & Time Slot
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking with <strong className="text-navy">{selectedProvider?.name}</strong> (Available on {dayName}: {providerDaySchedule?.active ? `${providerDaySchedule.start} - ${providerDaySchedule.end}` : "Off"})
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-navy flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change Pro
                </button>
              </div>

              {/* Date & Duration Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Date Picker (Today to 30 days ahead) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={todayStr}
                      max={maxDateStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-slate-200 font-semibold text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                  {priceBreakdown.isWeekend && (
                    <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      <Tag className="w-3 h-3 text-gold" />
                      Weekend booking (+15% surcharge applies)
                    </p>
                  )}
                  {priceBreakdown.isToday && (
                    <p className="text-[11px] font-semibold text-blue-700 flex items-center gap-1 bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                      <Zap className="w-3 h-3 text-blue-600" />
                      Same-day express booking (+10% express surcharge)
                    </p>
                  )}
                </div>

                {/* Duration Slider (Min to Max hours for this service) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Service Duration
                    </label>
                    <span className="text-sm font-extrabold text-navy font-heading bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {selectedDuration} {selectedDuration === 1 ? "Hour" : "Hours"}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={selectedService?.minHours || 1}
                    max={selectedService?.maxHours || 8}
                    step={1}
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Min: {selectedService?.minHours || 1} hr</span>
                    <span>Standard: {selectedService?.minHours || 2} hrs</span>
                    <span>Max: {selectedService?.maxHours || 8} hrs</span>
                  </div>
                </div>

              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Select Available Time Slot
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Slots are strictly filtered by {selectedProvider?.name}'s active hours.
                    </p>
                  </div>

                  {/* Legend: Peak (purple) vs Off-peak (green) */}
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-purple-700">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      Peak (+25%)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      Off-Peak (Standard)
                    </span>
                  </div>
                </div>

                {!providerDaySchedule?.active ? (
                  <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center text-rose-800">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1 text-rose-600" />
                    <p className="text-sm font-bold">{selectedProvider?.name} is off on {dayName}s.</p>
                    <p className="text-xs text-rose-600 mt-1">Please select another day or choose another provider who is available.</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 bg-slate-100 rounded-2xl text-center text-slate-500">
                    <Clock className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                    <p className="text-sm font-bold">No remaining slots available on this date.</p>
                    <p className="text-xs mt-1">All slots have elapsed or are currently booked. Please pick another date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      const isPeak = slot.isPeak;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-3 rounded-2xl border font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? "bg-navy text-gold border-navy ring-2 ring-gold shadow-md"
                              : isPeak
                              ? "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          <span className="text-sm">{slot.time}</span>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-gold text-navy"
                              : isPeak
                              ? "bg-purple-200 text-purple-900"
                              : "bg-emerald-200 text-emerald-900"
                          }`}>
                            {isPeak ? "Peak Slot" : "Off-Peak"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Provider
                </button>

                <button
                  type="button"
                  disabled={!selectedTimeSlot || !providerDaySchedule?.active}
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 rounded-2xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-sm shadow-md flex items-center gap-2 group transition-all disabled:opacity-50"
                >
                  <span>Review & Confirm</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-heading font-extrabold text-navy">
                  Step 3: Review Booking & Service Address
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Double check your appointment details before final authorization.
                </p>
              </div>

              {/* Full Booking Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Selected Service</span>
                  <p className="text-sm font-bold text-navy">{selectedService?.title}</p>
                  <p className="text-xs text-slate-500">{selectedDuration} Hours Slot</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Professional</span>
                  <p className="text-sm font-bold text-navy">{selectedProvider?.name}</p>
                  <p className="text-xs text-slate-500">₹{selectedProvider?.hourlyRate}/hr • Rating {selectedProvider?.avgRating} ★</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Date & Slot</span>
                  <p className="text-sm font-bold text-navy">{selectedDate} ({dayName})</p>
                  <p className="text-xs text-slate-500">{selectedTimeSlot} {priceBreakdown.isPeak ? "(Peak Slot)" : "(Off-Peak)"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Customer Details</span>
                  <p className="text-sm font-bold text-navy">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500">{currentUser?.email} • {currentUser?.phone}</p>
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Service Address (Required)</span>
                  <span className="text-[10px] font-medium text-slate-400">House / Flat, Landmark, City</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete door address, apartment name, street and pincode..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-surface border border-slate-200 text-sm font-medium text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    required
                  />
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Special Notes or Instructions for Provider (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please bring extra long ladder, call on arrival, beware of pet dog..."
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-slate-200 text-sm font-medium text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>

              {/* Saving Tip Box if Peak or Weekend Surcharge applies */}
              {(priceBreakdown.peakSurcharge > 0 || priceBreakdown.weekendSurcharge > 0) && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-navy font-bold block">💡 SmartServe Savings Tip</strong>
                    <span className="text-slate-600">
                      {priceBreakdown.peakSurcharge > 0 && (
                        <>You are booking in a peak slot (+25%). Book between 12:00 PM and 4:00 PM to save ₹{priceBreakdown.peakSurcharge}! </>
                      )}
                      {priceBreakdown.weekendSurcharge > 0 && (
                        <>Weekend bookings carry +15% demand surcharge. Choose a Monday–Friday slot to save ₹{priceBreakdown.weekendSurcharge}!</>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Confirmation CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Schedule
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !address.trim()}
                  onClick={handleConfirmBooking}
                  className="px-8 py-4 rounded-2xl bg-gold hover:bg-gold-600 text-navy font-heading font-extrabold text-base shadow-hover hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 fill-navy text-navy" />
                  <span>{isSubmitting ? "Confirming..." : `Confirm Booking • ₹${priceBreakdown.total}`}</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT 4 COLS: LIVE PRICING PANEL (updates in real-time) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-hover space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Breakdown</span>
                <h3 className="font-heading font-extrabold text-navy text-lg">Pricing Summary</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Real-Time
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Base Line Item */}
              <div className="flex items-center justify-between text-slate-600">
                <span>Base (₹{priceBreakdown.hourlyRate} × {priceBreakdown.hours} hrs)</span>
                <span className="font-bold text-navy font-mono">₹{priceBreakdown.base}</span>
              </div>

              {/* Peak Hour Surcharge */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                priceBreakdown.peakSurcharge > 0 
                  ? "bg-purple-50 text-purple-900 border border-purple-200" 
                  : "text-slate-400"
              }`}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Peak Surcharge (+25%)</span>
                </div>
                <span className="font-bold font-mono">
                  {priceBreakdown.peakSurcharge > 0 ? `+₹${priceBreakdown.peakSurcharge}` : "₹0"}
                </span>
              </div>

              {/* Weekend Surcharge */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                priceBreakdown.weekendSurcharge > 0 
                  ? "bg-amber-50 text-amber-900 border border-amber-200" 
                  : "text-slate-400"
              }`}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Weekend Surcharge (+15%)</span>
                </div>
                <span className="font-bold font-mono">
                  {priceBreakdown.weekendSurcharge > 0 ? `+₹${priceBreakdown.weekendSurcharge}` : "₹0"}
                </span>
              </div>

              {/* Same-day Express */}
              <div className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                priceBreakdown.expressSurcharge > 0 
                  ? "bg-blue-50 text-blue-900 border border-blue-200" 
                  : "text-slate-400"
              }`}>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Same-Day Express (+10%)</span>
                </div>
                <span className="font-bold font-mono">
                  {priceBreakdown.expressSurcharge > 0 ? `+₹${priceBreakdown.expressSurcharge}` : "₹0"}
                </span>
              </div>

              {/* Platform Fee */}
              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <span>Platform Escrow Fee (5%)</span>
                  <Info className="w-3 h-3 text-slate-400" title="Includes insurance & rework coverage" />
                </span>
                <span className="font-bold text-navy font-mono">+₹{priceBreakdown.platformFee}</span>
              </div>

            </div>

            {/* Total Line Item */}
            <div className="pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Payable</p>
                <p className="text-3xl font-heading font-extrabold text-navy">
                  ₹{priceBreakdown.total}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                  Escrow Protected
                </span>
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="p-3 bg-surface rounded-2xl text-[11px] text-slate-500 space-y-1.5 border border-slate-200/50">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Zero cancellation fee up to 2 hrs before slot</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-navy flex-shrink-0" />
                <span>SmartServe ₹10,000 damage protection</span>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
