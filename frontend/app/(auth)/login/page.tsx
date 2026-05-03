"use client";

import { useState } from "react";
import { request } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await request("/auth/login", "POST", form);
    setLoading(false);

    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-sm w-full p-8 bg-surface rounded-2xl shadow-md">
        <h1 className="text-center font-mono text-xl font-bold mb-6">Ethara AI</h1>
        <h2 className="text-center text-2xl font-semibold text-foreground mb-4">Welcome Back</h2>
        <p className="text-center text-muted mb-6">Sign in to your account</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-apple-blue"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-apple-blue"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full p-3 bg-foreground text-white rounded-full font-medium hover:bg-opacity-90 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}