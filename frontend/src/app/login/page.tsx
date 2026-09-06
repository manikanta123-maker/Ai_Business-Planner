"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${base}${endpoint}`;
  };

  const fillDemoCredentials = () => {
    setEmail("demo@example.com");
    setPassword("Password@123");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/v1/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Incorrect email or password. Please verify your credentials.");
      }

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server. Make sure the API is online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Sign in to manage your startup blueprints</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <span>{error}</span>
              {error.includes("Incorrect") && (
                <div className="text-xs text-zinc-400 pt-1">
                  Don't have an account yet?{" "}
                  <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
                    Click here to register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 block" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                required
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-400 block" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-zinc-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Demo Login Shortcut */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Use Demo Credentials (demo@example.com)</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          New to the platform?{" "}
          <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
