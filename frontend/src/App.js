import "./App.css";
import { useState, useEffect, useCallback } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import WalletConnectPopup from "./components/WalletConnectPopup";

import LoginPage from "./components/LoginPage";
import FreelancerDashboard from "./components/FreelancerDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import MyInternships from "./pages/MyInternships";

const USER_STORAGE_KEY = "deelance_user";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showWalletPopup, setShowWalletPopup] = useState(false);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowWalletPopup(true); // Show wallet connect popup after login
  };

  const handleLogout = () => {
    setUser(null);
    setShowWalletPopup(false);
  };

  const handleWalletPopupClose = useCallback(() => {
    setShowWalletPopup(false);
  }, []);

  return (
    <div className="cyber-page d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="flex-grow-1">
        <ErrorBoundary>
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                !user ? (
                  <LoginPage onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <LoginPage onLogin={handleLogin} />
                ) : user.type === "company" ? (
                  <CompanyDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <FreelancerDashboard user={user} onLogout={handleLogout} />
                )
              }
            />

            {/* My Internships */}
            <Route
              path="/my-internships"
              element={
                user ? (
                  <MyInternships user={user} />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            {/* Catch-all 404 → redirect home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </div>

      {/* Wallet Connect Popup — shows after login if wallet not connected */}
      {user && (
        <WalletConnectPopup
          show={showWalletPopup}
          onClose={handleWalletPopupClose}
        />
      )}

      <Footer />
    </div>
  );
}
