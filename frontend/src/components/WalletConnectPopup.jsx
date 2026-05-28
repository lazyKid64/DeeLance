import { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3Context";

/**
 * Modal popup that prompts the user to connect their MetaMask wallet.
 * Shows automatically after login when wallet is not connected.
 * Matches the existing DeeLance cyber/dark UI theme.
 */
export default function WalletConnectPopup({ show, onClose }) {
  const { connect, loading, isConnected, error } = useWeb3();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show && !isConnected) {
      // Small delay so the dashboard renders first
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
    if (isConnected) {
      setVisible(false);
      onClose?.();
    }
  }, [show, isConnected, onClose]);

  if (!visible) return null;

  const handleConnect = async () => {
    try {
      await connect();
    } catch (_) {
      // MetaMask rejection handled by Web3Context
    }
  };

  const handleSkip = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div
      className="wc-overlay"
      onMouseDown={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        animation: "wcFadeIn 0.3s ease",
      }}
    >
      <div
        className="wc-card"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #111915 0%, #0a0f0c 100%)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "20px",
          padding: "2.5rem",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,255,136,0.08), 0 0 40px rgba(0,0,0,0.5)",
          animation: "wcSlideUp 0.35s ease",
        }}
      >
        {/* Wallet icon */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,204,255,0.15))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          fontSize: "2rem",
          border: "1px solid rgba(0,255,136,0.25)",
        }}>
          🦊
        </div>

        <h3 style={{
          color: "#fff",
          fontSize: "1.35rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          letterSpacing: "0.5px",
        }}>
          Connect Your Wallet
        </h3>

        <p style={{
          color: "#8a9a8e",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
        }}>
          Connect MetaMask to create internships, stake ETH, and interact with smart contracts on the blockchain.
        </p>

        {error && (
          <div style={{
            background: "rgba(255,50,50,0.1)",
            border: "1px solid rgba(255,50,50,0.3)",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            marginBottom: "1rem",
            color: "#ff6b6b",
            fontSize: "0.85rem",
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: "linear-gradient(135deg, #00ff88, #00ccff)",
            border: "none",
            borderRadius: "12px",
            color: "#000",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "wait" : "pointer",
            letterSpacing: "0.5px",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
            marginBottom: "0.75rem",
          }}
        >
          {loading ? "Connecting…" : "🔗 Connect MetaMask"}
        </button>

        <button
          onClick={handleSkip}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#6a7a6e",
            fontWeight: 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Skip for now
        </button>
      </div>

      <style>{`
        @keyframes wcFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wcSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .wc-card:hover {
          border-color: rgba(0,255,136,0.35) !important;
        }
      `}</style>
    </div>
  );
}
