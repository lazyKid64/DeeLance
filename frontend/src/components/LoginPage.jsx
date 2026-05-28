import { useState } from "react";
import cyberVideo from "../assets/cyber1.mp4";
import FeaturesSection from "./FeaturesSection";
import { api } from "../api/client";

export default function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState("freelance");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!handle || !email || !password) {
      alert("Please fill all credentials!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await api.login({ handle, email, password, type: loginType });
      onLogin(user);
      setPassword("");
    } catch (err) {
      setError(err?.data?.error || err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container-fluid flex-grow-1 px-4 py-4">
        <div className="row g-4 align-items-stretch">
          {/* LEFT VIDEO PANEL */}
          <div className="col-12 col-lg-7">
            <div className="hero-panel h-100 d-flex align-items-center justify-content-center">
              <video
                className="hero-video"
                src={cyberVideo}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* RIGHT LOGIN PANEL */}
          <div className="col-12 col-lg-5">
            <div className="login-panel h-100">
              <div className="login-card">
                <div className="mb-3">
                  <h2 className="login-title">Login</h2>
                  <p className="login-desc">
                    Enter your credentials to access the dashboard.
                  </p>
                </div>

                {/* Toggle */}
                <div className="toggle-wrap mb-3">
                  <button
                    className={`toggle-btn ${loginType === "company" ? "active" : ""}`}
                    onClick={() => setLoginType("company")}
                    type="button"
                  >
                    Company
                  </button>

                  <button
                    className={`toggle-btn ${loginType === "freelance" ? "active" : ""}`}
                    onClick={() => setLoginType("freelance")}
                    type="button"
                  >
                    Freelance
                  </button>
                </div>

                <form onSubmit={submitLogin}>
                  <div className="mb-3">
                    <label className="form-label cyber-label">
                      Login Handle *
                    </label>
                    <input
                      type="text"
                      className="form-control cyber-input"
                      placeholder="@yourhandle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label cyber-label">Email *</label>
                    <input
                      type="email"
                      className="form-control cyber-input"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label cyber-label">Password *</label>
                    <input
                      type="password"
                      className="form-control cyber-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-3" role="alert">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn w-100 cyber-login-btn"
                    disabled={loading}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>

                  <p className="small mt-3 cyber-hint">
                    Mode:{" "}
                    <span className="cyber-highlight">
                      {loginType === "company"
                        ? "Company Credentials"
                        : "Freelance Credentials"}
                    </span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ FEATURES SECTION BELOW LOGIN */}
      <FeaturesSection />
    </>
  );
}
