import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";
import { 
  Zap, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  CalendarDays, 
  LayoutDashboard, 
  Briefcase,
  Layers
} from "lucide-react";

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { currentUser, role, isAdmin, isProvider, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigate helper
  const navigateTo = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const getDashboardTab = () => {
    if (isAdmin) return "admin-dashboard";
    if (isProvider) return "provider-dashboard";
    return "customer-dashboard";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo: ⚡ SmartServe (navy + gold) */}
          <div 
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-gold fill-gold" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-2xl font-heading font-extrabold text-navy tracking-tight">Smart</span>
                <span className="text-2xl font-heading font-extrabold text-gold tracking-tight">Serve</span>
              </div>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-600 -mt-1">
                Verified Services
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateTo("home")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === "home"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo("services")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === "services"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
            >
              Services
            </button>

            {/* Bookings Link */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigateTo("auth");
                } else if (isProvider) {
                  navigateTo("provider-dashboard");
                } else if (isAdmin) {
                  navigateTo("admin-dashboard");
                } else {
                  navigateTo("bookings");
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === "bookings"
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
            >
              Bookings
            </button>

            {/* Role-based Dashboard Link */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigateTo("auth");
                } else {
                  navigateTo(getDashboardTab());
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === "customer-dashboard" || currentTab === "provider-dashboard" || (currentTab === "admin-dashboard" && !isAdmin)
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
            >
              Dashboard
            </button>

            {/* Admin Link: (red, ⚙ Admin) ONLY visible when logged in as admin role */}
            {isAdmin && (
              <button
                onClick={() => navigateTo("admin-dashboard")}
                className={`ml-2 px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all border ${
                  currentTab === "admin-dashboard"
                    ? "bg-rose-600 text-white border-rose-600 shadow-md"
                    : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                }`}
              >
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>⚙ Admin</span>
              </button>
            )}
          </nav>

          {/* Right Actions: Auth, Notifications, Avatar */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <NotificationDropdown />

                {/* User Avatar & Info */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div 
                    onClick={() => navigateTo(getDashboardTab())}
                    className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-navy to-navy-700 text-gold flex items-center justify-center font-heading font-bold text-sm shadow-sm ring-2 ring-gold/30">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-navy leading-tight truncate max-w-[120px]">
                        {currentUser?.name || "Member"}
                      </p>
                      <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                        {role || "customer"}
                      </span>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigateTo("auth")}
                className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gold" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-navy hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => navigateTo("home")}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-navy hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo("services")}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-navy hover:bg-slate-50"
          >
            Services
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) navigateTo("auth");
              else if (isProvider) navigateTo("provider-dashboard");
              else if (isAdmin) navigateTo("admin-dashboard");
              else navigateTo("bookings");
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-navy hover:bg-slate-50"
          >
            Bookings
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) navigateTo("auth");
              else navigateTo(getDashboardTab());
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-navy hover:bg-slate-50"
          >
            Dashboard
          </button>

          {isAdmin && (
            <button
              onClick={() => navigateTo("admin-dashboard")}
              className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm text-rose-600 bg-rose-50 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              ⚙ Admin Panel
            </button>
          )}

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo("auth")}
                className="w-full py-3 rounded-xl bg-navy text-white text-center font-bold text-sm shadow-md"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
