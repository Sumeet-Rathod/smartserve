import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { BookingProvider } from "./context/BookingContext";
import { ToastContainer } from "./components/ToastContainer";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { BookingFlowPage } from "./pages/BookingFlowPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { ProviderDashboard } from "./pages/ProviderDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import { Zap, ShieldCheck } from "lucide-react";

function AppContent() {
  const { currentUser, role, isAdmin, isProvider, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState("home");
  const [bookingService, setBookingService] = useState(null);

  // Quick action: start booking for a service
  const handleStartBooking = (service) => {
    setBookingService(service);
    setCurrentTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Redirect after auth
  const handleAuthSuccess = (userRole) => {
    if (userRole === "admin") {
      setCurrentTab("admin-dashboard");
    } else if (userRole === "provider") {
      setCurrentTab("provider-dashboard");
    } else {
      setCurrentTab("customer-dashboard");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] text-slate-800 antialiased font-sans">
      {/* Real-time Toast Notification Stack */}
      <ToastContainer />

      {/* Main Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentTab === "home" && (
          <HomePage
            onNavigateServices={() => {
              setCurrentTab("services");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onStartBooking={handleStartBooking}
          />
        )}

        {currentTab === "services" && (
          <ServicesPage onSelectService={handleStartBooking} />
        )}

        {currentTab === "booking" && (
          <BookingFlowPage
            initialService={bookingService}
            onNavigateBookings={() => {
              setCurrentTab("bookings");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateAuth={() => {
              setCurrentTab("auth");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {currentTab === "bookings" && (
          <MyBookingsPage
            onNavigateServices={() => {
              setCurrentTab("services");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {currentTab === "customer-dashboard" && (
          <CustomerDashboard
            onNavigateServices={() => {
              setCurrentTab("services");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateBookings={() => {
              setCurrentTab("bookings");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {currentTab === "provider-dashboard" && (
          <ProviderDashboard
            onNavigateHome={() => setCurrentTab("home")}
            onNavigateLogin={() => setCurrentTab("auth")}
          />
        )}

        {currentTab === "admin-dashboard" && (
          <AdminDashboard
            onNavigateHome={() => setCurrentTab("home")}
            onNavigateLogin={() => setCurrentTab("auth")}
          />
        )}

        {currentTab === "auth" && (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
