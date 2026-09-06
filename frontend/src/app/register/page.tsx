"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2, XCircle, Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic Password Validation Checks
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: false,
  });

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:",.<>?/~`]/.test(password),
      match: password.length > 0 && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const allChecksPassed = Object.values(checks).every(Boolean);

  const fillSuggestedPassword = () => {
    const sample = "Strategy#2026";
    setPassword(sample);
    setConfirmPassword(sample);
    setError(null);
  };

  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${base}${endpoint}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!checks.length || !checks.upper || !checks.lower || !checks.number || !checks.special) {
      setError("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol (e.g. Strategy#2026).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user
      const registerResponse = await fetch(getApiUrl("/api/v1/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          confirm_password: confirmPassword 
        }),
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(data.detail || "Registration failed. Email might already be registered.");
      }

      const userId = data.id;

      // 2. Activate email verification for instant onboarding
      try {
        await fetch(getApiUrl(`/api/v1/auth/verify-email/${userId}`), {
          method: "POST",
        });
      } catch (err) {
        console.warn("Verification ping warning:", err);
      }

      // 3. Auto-login immediately
      try {
        const loginResp = await fetch(getApiUrl("/api/v1/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (loginResp.ok) {
          const loginData = await loginResp.json();
          localStorage.setItem("access_token", loginData.access_token);
          localStorage.setItem("refresh_token", loginData.refresh_token);
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
          return;
        }
      } catch (err) {
        console.warn("Auto-login fallback:", err);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-lg bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative my-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Get started with AI Business Architect</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
            <span>Account created successfully! Launching your workspace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="name"
                type="text"
                required
                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                required
                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-zinc-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Suggested Password Shortcut */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={fillSuggestedPassword}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Use sample password (Strategy#2026)</span>
            </button>
          </div>

          {/* Validation Checklist UI */}
          <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl space-y-2 mt-2">
            <div className="text-xs font-bold text-zinc-400">Password Requirements:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center gap-2">
                {checks.length ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.length ? "text-emerald-300 font-medium" : "text-zinc-500"}>8+ characters</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.upper ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.upper ? "text-emerald-300 font-medium" : "text-zinc-500"}>Uppercase (A-Z)</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.lower ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.lower ? "text-emerald-300 font-medium" : "text-zinc-500"}>Lowercase (a-z)</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.number ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.number ? "text-emerald-300 font-medium" : "text-zinc-500"}>Number (0-9)</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.special ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.special ? "text-emerald-300 font-medium" : "text-zinc-500"}>Special symbol (!@#...)</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.match ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                <span className={checks.match ? "text-emerald-300 font-medium" : "text-zinc-500"}>Passwords match</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
              allChecksPassed 
                ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99]" 
                : "bg-indigo-600/60 hover:bg-indigo-600/80 cursor-pointer"
            } mt-4`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
