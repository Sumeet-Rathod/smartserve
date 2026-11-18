import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  ShieldAlert, 
  Sparkles 
} from "lucide-react";

export const AuthPage = ({ onAuthSuccess }) => {
  const { login, signup, loading } = useAuth();
  const { showToast } = useNotifications();

  // Mode: "signin" | "signup"
  const [isSignIn, setIsSignIn] = useState(true);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("customer"); // 'customer' | 'provider'

  // Auto-fill demo credentials
  const handleUseDemo = (demoEmail, demoPass) => {
    setIsSignIn(true);
    setEmail(demoEmail);
    setPassword(demoPass);
    showToast({
      title: "Credentials Filled",
      message: `Selected ${demoEmail}. Click 'Sign In' to proceed.`,
      type: "info"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      if (!email.trim() || !password.trim()) {
        showToast({ title: "Incomplete Form", message: "Please provide both email and password.", type: "warn" });
        return;
      }

      const res = await login(email, password);
      if (res.success) {
        showToast({
          title: "Welcome Back!",
          message: `Signed in as ${res.user.displayName || res.user.email} (${res.user.role || 'customer'}).`,
          type: "success"
        });
        if (onAuthSuccess) onAuthSuccess(res.user.role);
      } else {
        showToast({
          title: "Sign In Failed",
          message: res.error || "Invalid email or password.",
          type: "danger"
        });
      }
    } else {
      // Sign Up
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast({ title: "Incomplete Form", message: "Please fill in all required fields.", type: "warn" });
        return;
      }

      const res = await signup(name, email, password, role, phone, address);
      if (res.success) {
        showToast({
          title: "Account Created!",
          message: `Welcome to SmartServe, ${name}! Your account is active.`,
          type: "success"
        });
        if (onAuthSuccess) onAuthSuccess(res.user.role);
      } else {
        showToast({
          title: "Sign Up Failed",
          message: res.error || "Unable to register.",
          type: "danger"
        });
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-100 shadow-hover overflow-hidden">
        
        {/* LEFT 5 COLS: DEMO CREDENTIALS BOX & BRANDING */}
        <div className="lg:col-span-5 bg-navy p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                <Zap className="w-6 h-6 text-gold fill-gold" />
              </div>
              <span className="text-2xl font-heading font-extrabold text-white tracking-tight">Smart<span className="text-gold">Serve</span></span>
            </div>

            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">
                One-Click Demo Access
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Explore each persona with tailored role permissions:
              </p>
            </div>

            {/* DEMO CREDENTIALS BOX */}
            <div className="space-y-3">
              
              {/* Admin Card */}
              <div className="p-3.5 rounded-2xl bg-navy-800/90 border border-navy-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    Admin Role
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUseDemo("admin@smartserve.com", "Admin@123")}
                    className="text-xs font-bold text-gold hover:text-gold-300 flex items-center gap-1"
                  >
                    Use →
                  </button>
                </div>
                <p className="text-xs font-mono font-bold text-slate-200">admin@smartserve.com</p>
                <p className="text-[11px] font-mono text-slate-400">Password: Admin@123</p>
              </div>

              {/* Provider Card */}
              <div className="p-3.5 rounded-2xl bg-navy-800/90 border border-navy-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    Provider Role
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUseDemo("provider@smartserve.com", "Provider@123")}
                    className="text-xs font-bold text-gold hover:text-gold-300 flex items-center gap-1"
                  >
                    Use →
                  </button>
                </div>
                <p className="text-xs font-mono font-bold text-slate-200">provider@smartserve.com</p>
                <p className="text-[11px] font-mono text-slate-400">Password: Provider@123</p>
              </div>

              {/* Customer Card */}
              <div className="p-3.5 rounded-2xl bg-navy-800/90 border border-navy-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Customer Role
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUseDemo("user@smartserve.com", "User@123")}
                    className="text-xs font-bold text-gold hover:text-gold-300 flex items-center gap-1"
                  >
                    Use →
                  </button>
                </div>
                <p className="text-xs font-mono font-bold text-slate-200">user@smartserve.com</p>
                <p className="text-[11px] font-mono text-slate-400">Password: User@123</p>
              </div>

            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-navy-700 text-[11px] text-slate-400">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Synced with Firebase Firestore in real-time</span>
            </p>
          </div>
        </div>

        {/* RIGHT 7 COLS: AUTH FORM (SIGN IN / SIGN UP) */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          
          {/* Mode Switch Tabs */}
          <div className="flex items-center p-1 bg-surface rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs transition-all ${
                isSignIn ? "bg-navy text-white shadow-sm" : "text-slate-600 hover:text-navy"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs transition-all ${
                !isSignIn ? "bg-navy text-white shadow-sm" : "text-slate-600 hover:text-navy"
              }`}
            >
              Create Account
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-heading font-extrabold text-navy">
              {isSignIn ? "Welcome Back to SmartServe" : "Create Your SmartServe Account"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isSignIn 
                ? "Enter your credentials or click any demo role on the left."
                : "Join thousands of customers and verified providers."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Sign Up: Name & Role Picker */}
            {!isSignIn && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    I am joining as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === "customer"
                          ? "bg-navy text-gold border-navy shadow-sm ring-1 ring-gold/40"
                          : "bg-surface border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("provider")}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === "provider"
                          ? "bg-navy text-gold border-navy shadow-sm ring-1 ring-gold/40"
                          : "bg-surface border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Service Pro</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                  required
                />
              </div>
            </div>

            {/* If Sign Up: Phone & Address */}
            {!isSignIn && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Indiranagar, Bengaluru, KA"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface border border-slate-200 text-xs font-semibold text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-navy hover:bg-navy-800 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : isSignIn ? "Sign In to Account" : "Register with SmartServe"}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
