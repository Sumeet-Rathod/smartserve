import React from "react";
import { Zap, ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-navy text-slate-300 border-t border-navy-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo + Tagline on Left */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/30">
              <Zap className="w-5 h-5 text-gold fill-gold" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-xl font-heading font-extrabold text-white">Smart</span>
                <span className="text-xl font-heading font-extrabold text-gold">Serve</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                India's trusted platform for verified home & lifestyle services.
              </p>
            </div>
          </div>

          {/* Copyright Center */}
          <div className="text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} SmartServe Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              100% Background-Checked Professionals & Escrow Assured
            </p>
          </div>

          {/* Privacy/Terms/Contact text on Right (no clickable links in footer) */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="cursor-default select-none">Privacy Policy</span>
            <span className="text-slate-600">•</span>
            <span className="cursor-default select-none">Terms of Service</span>
            <span className="text-slate-600">•</span>
            <span className="cursor-default select-none">Contact & Grievance</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
