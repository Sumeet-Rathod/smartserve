import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, db } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("smartserve_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("smartserve_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("smartserve_current_user");
    }
  }, [currentUser]);

  // Sync current user if modified in Firestore
  useEffect(() => {
    if (!currentUser) return;
    const unsub = db.onSnapshot("users", (snapshot) => {
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const fresh = users.find(u => u.id === currentUser.id || u.email === currentUser.email);
      if (fresh) {
        setCurrentUser(prev => ({
          ...prev,
          name: fresh.name,
          phone: fresh.phone,
          address: fresh.address,
          isActive: fresh.isActive !== false,
          role: fresh.role
        }));
      }
    });
    return () => unsub();
  }, [currentUser?.email]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = "customer", phone = "", address = "") => {
    setLoading(true);
    try {
      const user = await authService.signUp(name, email, password, role, phone, address);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem("smartserve_current_user");
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    await db.updateDoc("users", currentUser.id || currentUser.uid, updates);
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    currentUser,
    role: currentUser?.role || null,
    isAdmin: currentUser?.role === "admin",
    isProvider: currentUser?.role === "provider",
    isCustomer: currentUser?.role === "customer",
    isAuthenticated: Boolean(currentUser),
    login,
    signup,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
