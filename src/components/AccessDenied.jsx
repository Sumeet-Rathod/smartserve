import React from "react";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AccessDenied = ({ requiredRole = "Admin", onNavigateHome, onNavigateLogin }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-hover text-center">
        <div className="w-18 h-18 mx-auto mb-6 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-100 text-rose-700 mb-3">
          403 — Restricted Area
        </span>

        <h1 className="text-2xl font-heading font-extrabold text-navy mb-2">
          Access Denied
        </h1>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          This portal is reserved strictly for <strong className="text-navy">{requiredRole}</strong> accounts.
          {currentUser ? (
            <> You are currently signed in as <span className="font-semibold text-rose-600">{currentUser.email}</span> (role: <span className="font-mono text-xs uppercase bg-slate-100 px-1.5 py-0.5 rounded">{currentUser.role || "customer"}</span>).</>
          ) : (
            <> You must be signed in with administrative credentials.</>
          )}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (onNavigateLogin) onNavigateLogin();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-navy hover:bg-navy-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
          >
            <LogIn className="w-4 h-4 text-gold" />
            Switch to {requiredRole} Account
          </button>

          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
