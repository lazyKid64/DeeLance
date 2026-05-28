import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";

export default function Navbar({ user, onLogout }) {
  const [openProfile, setOpenProfile] = useState(false);
  const panelRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { address, balance, loading, connect, refreshBalance, isConnected } = useWeb3();



  // ✅ close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpenProfile(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg cyber-nav px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* ✅ BRAND FIXED */}
        <a className="navbar-brand cyber-brand" href="/">
          <span className="brand-primary">Dee</span>
          <span className="brand-secondary">Lance</span>
        </a>

        {/* ✅ When user NOT logged in */}
        {user ? (
  <div ref={panelRef} className="d-flex align-items-center gap-2 position-relative nav-menu-wrap">
    {/* Connect Wallet + Show Balance */}
    {!isConnected ? (
      <button
        type="button"
        className="btn cyber-wallet-btn"
        onClick={connect}
        disabled={loading}
      >
        {loading ? "Connecting…" : "🔗 Connect Wallet"}
      </button>
    ) : (
      <>
        <button type="button" className="btn cyber-wallet-btn connected" disabled>
          {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connected"}
        </button>
        <button
          type="button"
          className="btn cyber-balance-btn"
          onClick={refreshBalance}
          title="Refresh balance"
        >
          ⟠ {balance || "0"} ETH
        </button>
      </>
    )}
    {/* ✅ User Name Button (details panel stays same) */}
    <button
      className="btn cyber-user-btn"
      onClick={() => { setOpenProfile(!openProfile); setMenuOpen(false); }}
      type="button"
    >
      <span>👤 {user.handle}</span>
      <span className={`arrow ${openProfile ? "up" : ""}`}>▾</span>
    </button>

    {/* ✅ Floating user details panel (same as before) */}
    <div className={`user-panel-float ${openProfile ? "show" : ""}`}>
      <div className="user-panel-title">Personal Details</div>

      <div className="user-row">
        <span className="user-key">Handle</span>
        <span className="user-val">{user.handle}</span>
      </div>

      <div className="user-row">
        <span className="user-key">Email</span>
        <span className="user-val">{user.email}</span>
      </div>

      <div className="user-row">
        <span className="user-key">Account</span>
        <span className="user-val cyber-highlight">
          {user.type === "freelance" ? "Freelancer" : "Company"}
        </span>
      </div>
    </div>

    {/* ✅ Hamburger Dropdown (with Logout inside) */}
    <div className="dash-dropdown-wrap">
      <button
        className="btn cyber-hamburger-btn"
        onClick={() => { setMenuOpen(!menuOpen); setOpenProfile(false); }}
        type="button"
        aria-label="Open menu"
      >
        <span className="hamburger-lines">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div className={`dash-dropdown ${menuOpen ? "show" : ""}`}>
        <div className="dash-dropdown-title">MENU</div>

        <button
          className={`dash-dropdown-item${currentPath === "/dashboard" ? " active" : ""}`}
          type="button"
          disabled={currentPath === "/dashboard"}
          onClick={() => {
            navigate("/dashboard");
            setMenuOpen(false);
          }}
        >
          {currentPath === "/dashboard" ? "📍 Dashboard" : "Dashboard"}
        </button>
        <button
            className={`dash-dropdown-item${currentPath === "/my-internships" ? " active" : ""}`}
            type="button"
            disabled={currentPath === "/my-internships"}
            onClick={() => {
              navigate("/my-internships");
              setMenuOpen(false);
            }}
          >
            {currentPath === "/my-internships" ? "📍 My Internships" : "My Internships"}
          </button>

        
        

        <div className="dash-dropdown-divider"></div>

        {/* ✅ Logout inside dropdown */}
        <button
          className="dash-dropdown-item logout"
          type="button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="d-flex gap-2">
    <button className="btn cyber-nav-btn">Home</button>
    <button className="btn cyber-nav-btn">Docs</button>
    <button className="btn cyber-nav-btn">Support</button>
  </div>
)}
        </div>
    </nav>
  );
}
