import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  DollarSign, 
  CalendarCheck, 
  HeartHandshake, 
  BadgePercent,
  Laptop,
  Paintbrush
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export const HomePage = ({ onNavigateServices, onStartBooking }) => {
  const { services, providers } = useBooking();

  // 3 Popular services preview
  const popularServices = services.filter(s => s.popular).slice(0, 3);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case "Wrench": return <Wrench className="w-6 h-6 text-gold" />;
      case "Sparkles": return <Sparkles className="w-6 h-6 text-gold" />;
      case "Laptop": return <Laptop className="w-6 h-6 text-gold" />;
      case "Paintbrush": return <Paintbrush className="w-6 h-6 text-gold" />;
      default: return <Wrench className="w-6 h-6 text-gold" />;
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-surface to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 text-navy font-bold text-xs tracking-wide">
                <Sparkles className="w-4 h-4 text-gold fill-gold" />
                <span>Urban Quality • Indian Reliability • Zero Surprises</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-navy tracking-tight leading-[1.1]">
                Book Verified Services, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-600">
                  Hassle-Free.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with background-verified technicians, certified deep cleaners, and master craftspeople across top Indian metros. Transparent hourly rates, live scheduling, and guaranteed satisfaction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onNavigateServices}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-base shadow-hover hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                  <span>Explore 6 Services</span>
                  <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3 px-4 py-2 text-xs text-slate-500 font-medium">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80" alt="Provider" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Provider" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Provider" />
                  </div>
                  <span>Over 1,200+ trained experts standing by</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Govt ID Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">On-Time Arrival</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Clear Pricing</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Mock Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-gold fill-gold" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-navy text-sm">SmartServe Guarantee</h4>
                      <p className="text-[11px] text-slate-500">Live booking engine</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    Active Slots
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="p-3 rounded-2xl bg-surface border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs">
                        HR
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy">Home Repair & Fixture</p>
                        <p className="text-[11px] text-slate-500">Rajesh Kumar • 4.9 ★</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-navy">₹320/hr</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gold text-navy flex items-center justify-center font-bold text-xs">
                        DC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy">Deep Sanitization</p>
                        <p className="text-[11px] text-slate-500">Priya Mehta • 4.85 ★</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-navy">₹260/hr</span>
                  </div>

                  {/* Realtime Pricing Preview Box */}
                  <div className="p-4 rounded-2xl bg-navy text-white space-y-2 mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Base (2 hrs)</span>
                      <span>₹520</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-purple-300">
                      <span>Peak Hour Surcharge (+25%)</span>
                      <span>+₹130</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Platform Fee (5%)</span>
                      <span>+₹33</span>
                    </div>
                    <div className="pt-2 border-t border-navy-700 flex items-center justify-between font-heading font-extrabold text-sm text-gold">
                      <span>Live Total</span>
                      <span>₹683</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onNavigateServices}
                  className="w-full mt-2 py-3 rounded-xl bg-gold hover:bg-gold-600 text-navy font-heading font-extrabold text-sm transition-all shadow-md text-center"
                >
                  Book Instant Slot Now
                </button>
              </div>

              {/* Decorative Blur Circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-navy/10 rounded-full blur-3xl pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-8 sm:p-12 shadow-hover text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#E8A020_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-navy-700">
            <div className="space-y-2 pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-gold tracking-tight">
                50,000+
              </p>
              <p className="text-sm font-semibold text-slate-200">Delighted Indian Customers</p>
              <p className="text-xs text-slate-400">Servicing Bengaluru, Mumbai, Delhi-NCR & Hyderabad</p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-gold tracking-tight">
                1,200+
              </p>
              <p className="text-sm font-semibold text-slate-200">Verified Service Providers</p>
              <p className="text-xs text-slate-400">Strictly police-verified and skill-assessed</p>
            </div>

            <div className="space-y-2 pt-4 md:pt-0">
              <p className="text-4xl sm:text-5xl font-heading font-extrabold text-gold tracking-tight">
                98%
              </p>
              <p className="text-sm font-semibold text-slate-200">Satisfaction & Repeat Rate</p>
              <p className="text-xs text-slate-400">Backed by our SmartServe 100% rework guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4 STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-navy mt-3">
            How SmartServe Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            From discovering verified experts to rating completed work in four easy, transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Choose Service",
              desc: "Select from 6 curated home services with standardized pricing and hour estimations.",
              icon: <Wrench className="w-6 h-6 text-navy" />
            },
            {
              step: "02",
              title: "Pick Provider",
              desc: "Compare verified professionals, view their past ratings, jobs done, and custom weekly schedule.",
              icon: <Users className="w-6 h-6 text-navy" />
            },
            {
              step: "03",
              title: "Book Slot",
              desc: "Pick your preferred date and peak/off-peak time slot with instantaneous live pricing breakdown.",
              icon: <CalendarCheck className="w-6 h-6 text-navy" />
            },
            {
              step: "04",
              title: "Rate & Relax",
              desc: "Pay securely after work is completed to your delight and share your genuine review.",
              icon: <Star className="w-6 h-6 text-navy" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-hover transition-all duration-300 relative group"
            >
              <div className="text-3xl font-heading font-extrabold text-slate-200 group-hover:text-gold/40 transition-colors absolute top-5 right-5">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface border border-slate-200 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-navy mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POPULAR SERVICES PREVIEW (3 cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full">
              Most Requested
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-navy mt-2">
              Popular Home Services
            </h2>
          </div>
          <button
            onClick={onNavigateServices}
            className="text-sm font-bold text-navy hover:text-gold flex items-center gap-1.5 transition-colors"
          >
            <span>View All 6 Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-subtle hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-navy mb-2">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Starting from</span>
                    <p className="text-2xl font-heading font-extrabold text-navy">
                      ₹{service.pricePerHour}<span className="text-xs text-slate-400 font-sans font-normal">/hr</span>
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-semibold text-slate-700">{service.providerCount}+ Pros</span>
                    <p className="text-gold font-bold">★ {service.rating}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface border-t border-slate-100">
                <button
                  onClick={() => onStartBooking(service)}
                  className="w-full py-3 rounded-xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group-hover:bg-gold group-hover:text-navy"
                >
                  <span>Book {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRANSPARENT PRICING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-3xl p-8 sm:p-12 border border-amber-200/50 shadow-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-navy bg-gold/20 px-3 py-1 rounded-full">
                Zero Hidden Charges
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-navy">
                Transparent & Honest Pricing
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe in full clarity before you commit. Every invoice breaks down the technician’s hourly base, transparent demand surcharges (peak or weekend), and our minimal 5% platform fee for quality escrow and guarantee.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-navy block">Peak Hours Explained</strong>
                    <span className="text-xs text-slate-500">Slots between 9:00 AM–12:00 PM and 4:00 PM–7:00 PM carry a +25% surcharge for rapid mobilization.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-navy block">Off-Peak Savings</strong>
                    <span className="text-xs text-slate-500">Afternoon weekday slots (12:00 PM–4:00 PM) are standard green rate with 0% surcharge.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-navy block">5% Escrow Protection</strong>
                    <span className="text-xs text-slate-500">Funds are held safely and only disbursed when you sign off on complete satisfaction.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Example Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-hover">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sample Bill Breakdown</span>
                    <h4 className="text-base font-heading font-bold text-navy">Deep Cleaning (3 Hours)</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900">
                    Live Demo
                  </span>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Base Charge (₹260 × 3 hrs)</span>
                    <span className="font-semibold text-navy">₹780</span>
                  </div>
                  <div className="flex justify-between items-center text-purple-700 bg-purple-50 p-2 rounded-lg">
                    <span>Peak Slot Surcharge (10:00 AM • +25%)</span>
                    <span className="font-bold">+₹195</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Weekend Surcharge (Weekday booking)</span>
                    <span className="font-medium text-emerald-600">₹0 (Saved 15%)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Platform Quality Fee (5%)</span>
                    <span className="font-semibold text-navy">₹49</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Final Total</p>
                    <p className="text-2xl font-heading font-extrabold text-navy">₹1,024</p>
                  </div>
                  <button
                    onClick={onNavigateServices}
                    className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-600 text-navy font-heading font-bold text-xs transition-all shadow-sm"
                  >
                    Try Live Calculator
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy via-navy-800 to-navy rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-gold fill-gold" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight">
              Ready for Pristine, Reliable Home Service?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Book a verified professional in under 2 minutes. Guaranteed punctuality, transparent live pricing, and verified quality.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onNavigateServices}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gold hover:bg-gold-600 text-navy font-heading font-extrabold text-base shadow-lg hover:shadow-xl transition-all"
              >
                Browse Services & Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
