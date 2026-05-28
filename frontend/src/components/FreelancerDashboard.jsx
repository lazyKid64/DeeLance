import { useEffect, useRef, useState } from "react";
import BrowseInternships from "../components/BrowseInternships";
import { useWeb3 } from "../context/Web3Context";
import cyberVideo from "../assets/cyber1.mp4";

export default function FreelancerDashboard({ user }) {
  const [active] = useState("Dashboard"); // eslint-disable-line no-unused-vars
  const [menuOpen, setMenuOpen] = useState(false);  // eslint-disable-line no-unused-vars
  const menuRef = useRef(null);
  const { address, balance, loading: walletLoading, connect, refreshBalance, isConnected } = useWeb3(); // eslint-disable-line no-unused-vars

  // ✅ close dropdown when clicking outside
  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const categories = [
    { name: "Dashboard", icon: "🏠" },
    { name: "My Internships", icon: "📂" },
    { name: "Payments", icon: "💳" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="container-fluid flex-grow-1 px-4 py-4">
      {/* ✅ Hero Section with animation */}
      <div
        className="mb-4"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "0 0 auto", paddingRight: "1rem" }}>
          <h2 className="dash-heading mb-1">
            Welcome, <span className="cyber-highlight">{user?.handle}</span> ⚡
          </h2>
          <p className="dash-subheading m-0">
            Manage your projects, payments, and wallet.
          </p>
        </div>
        <div style={{ flex: "1 1 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: "570px",
              height: "120px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(0,255,136,0.15)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <video
              src={cyberVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="dash-main">
        <h5 className="dash-title">Current Category</h5>
        <p className="dash-subheading">
          You opened: <span className="cyber-highlight">{active}</span>
        </p>

        <div className="mt-4">
          <BrowseInternships />
        </div>
      </div>
    </div>
  );
}
