/**
 * API client for DeeLance backend (MongoDB).
 * Auto-detects production vs local environment.
 */

const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
const BASE = isLocal ? "http://localhost:5000" : "https://deelance.onrender.com";

async function request(path, options = {}) {
  const url = `${BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  async login(body) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async createInternship(body) {
    return request("/api/internships", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getInternships() {
    return request("/api/internships");
  },
};

export default api;
