import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, CheckCheck, Clock, Sparkles, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <Sparkles className="w-4 h-4 text-gold" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "danger":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Just now";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-rose-500 rounded-full animate-pulse shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-hover border border-slate-100 py-3 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-navy text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-gold/20 text-navy px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-slate-500 hover:text-gold flex items-center gap-1 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 stroke-1 opacity-50" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start gap-3 ${
                    !item.read ? "bg-amber-50/40" : ""
                  }`}
                >
                  <div className="mt-1 p-1.5 rounded-lg bg-slate-100/80">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold ${!item.read ? "text-navy" : "text-slate-700"}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(item.timestamp || item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
