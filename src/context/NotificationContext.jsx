import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Subscribe to real-time notifications in Firestore
  useEffect(() => {
    const unsub = db.onSnapshot("notifications", (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort newest first
      items.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
      setNotifications(items);
    });

    return () => unsub();
  }, []);

  // Show a temporary slide-in toast (auto dismissed after 4s)
  const showToast = ({ title, message, type = "info", duration = 4000 }) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    return id;
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add a persistent notification that also triggers a toast
  const addNotification = async ({ title, message, type = "info", userId = "all" }) => {
    // 1. Show immediate toast
    showToast({ title, message, type, duration: 4000 });

    // 2. Persist to Firestore
    const notifItem = {
      title,
      message,
      type, // 'success' | 'info' | 'booking' | 'danger' | 'warn'
      userId,
      read: false,
      timestamp: new Date().toISOString()
    };

    try {
      await db.addDoc("notifications", notifItem);
    } catch (err) {
      console.error("Failed to persist notification:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await db.updateDoc("notifications", id, { read: true });
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all / mark all as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    for (const notif of notifications) {
      if (!notif.read) {
        try {
          await db.updateDoc("notifications", notif.id, { read: true });
        } catch (e) {
          // continue
        }
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    toasts,
    notifications,
    unreadCount,
    showToast,
    dismissToast,
    addNotification,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
