import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { CheckCircle2, AlertCircle, Info, Sparkles, X, AlertTriangle } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const typeConfigs = {
          success: {
            bg: "bg-emerald-50 border-emerald-500 text-emerald-950",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
            badge: "bg-emerald-100 text-emerald-800"
          },
          info: {
            bg: "bg-blue-50 border-blue-500 text-blue-950",
            icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
            badge: "bg-blue-100 text-blue-800"
          },
          booking: {
            bg: "bg-amber-50 border-gold text-amber-950",
            icon: <Sparkles className="w-5 h-5 text-gold flex-shrink-0" />,
            badge: "bg-gold/20 text-navy"
          },
          danger: {
            bg: "bg-rose-50 border-rose-500 text-rose-950",
            icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
            badge: "bg-rose-100 text-rose-800"
          },
          warn: {
            bg: "bg-orange-50 border-orange-500 text-orange-950",
            icon: <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />,
            badge: "bg-orange-100 text-orange-800"
          }
        };

        const config = typeConfigs[toast.type] || typeConfigs.info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border-l-4 shadow-hover rounded-xl p-4 flex items-start gap-3 backdrop-blur-md bg-white/95 animate-slide-in-right transition-all duration-300 ${config.bg}`}
          >
            <div className="mt-0.5">{config.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-bold text-navy leading-tight">
                  {toast.title}
                </p>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${config.badge}`}>
                  {toast.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
