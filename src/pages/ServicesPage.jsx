import React, { useState, useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import { 
  Search, 
  Wrench, 
  Sparkles, 
  Laptop, 
  Trees, 
  Paintbrush, 
  Truck, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Filter
} from "lucide-react";

export const ServicesPage = ({ onSelectService }) => {
  const { services } = useBooking();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Repair & Maintenance", "Cleaning", "Technology", "Outdoor", "Painting", "Logistics"];

  const getServiceIcon = (iconName) => {
    const props = { className: "w-7 h-7 text-gold" };
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

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch = 
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || srv.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Description */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full">
          Verified Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-navy">
          Our Home & Lifestyle Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Standardized hourly tariffs, verified pros, and flexible slots. Select a service to customize your booking.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name, keywords (e.g. plumbing, AC, paint, garden)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface border border-slate-200 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-sm transition-all text-navy placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 self-start md:self-auto">
            <Filter className="w-4 h-4 text-gold" />
            <span>Showing {filteredServices.length} Services</span>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-navy text-white shadow-sm"
                  : "bg-surface text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (6 Services) */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-subtle max-w-md mx-auto">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-navy">No services found</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching for other terms like 'cleaning' or 'repair'.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-4 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-subtle hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden group"
            >
              <div className="p-7 flex-1 flex flex-col">
                
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-navy uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-heading font-bold text-navy group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  {service.popular && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gold/20 text-navy">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                {/* Service Specs: Duration & Providers */}
                <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-2xl bg-surface border border-slate-200/60 mb-6 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{service.minHours}–{service.maxHours} Hours slot</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4 text-navy flex-shrink-0" />
                    <span>{service.providerCount}+ Verified Pros</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Tariff</span>
                    <p className="text-2xl font-heading font-extrabold text-navy">
                      ₹{service.pricePerHour}
                      <span className="text-xs font-sans text-slate-500 font-normal"> / hour</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span>{service.rating || 4.9}</span>
                    <span className="text-[10px] text-slate-400">({service.reviewsCount || 500}+)</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="p-4 bg-surface/80 border-t border-slate-100">
                <button
                  onClick={() => onSelectService(service)}
                  className="w-full py-3 rounded-2xl bg-navy hover:bg-navy-800 text-white font-heading font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-gold group-hover:text-navy"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
