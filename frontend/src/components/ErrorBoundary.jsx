import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2rem",
          textAlign: "center",
        }}>
          <div style={{
            background: "rgba(255,50,50,0.08)",
            border: "1px solid rgba(255,50,50,0.25)",
            borderRadius: "16px",
            padding: "2.5rem",
            maxWidth: "500px",
            backdropFilter: "blur(12px)",
          }}>
            <h2 style={{ color: "#ff4444", fontSize: "1.5rem", marginBottom: "1rem" }}>
              ⚠️ Something went wrong
            </h2>
            <p style={{ color: "#aaa", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              style={{
                padding: "0.7rem 2rem",
                background: "linear-gradient(135deg, #00ff88, #00ccff)",
                border: "none",
                borderRadius: "8px",
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ↻ Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
