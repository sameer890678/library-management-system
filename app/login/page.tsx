"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [messageType, setMessageType] = useState<"success" | "error" | "warning">("error");
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("1. SIGN IN FINISHED", data, error);
    
    if (error) {
      setMessageType("error");
    
      if (error.message === "Invalid login credentials") {
        setMessage("Invalid email or password.");
      } else {
        setMessage(error.message);
      }
    
      setLoading(false);
      return;
    }
    
    if (!data.user) {
      setMessage("Login failed.");
      setLoading(false);
      return;
    }
    
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("status, role")
      .eq("user_id", data.user.id)
      .single();

      console.log("2. MEMBER QUERY FINISHED", member, memberError);
    
    if (memberError || !member) {
      setMessage("Member account not found.");
      setLoading(false);
      return;
    }
    
    if (member.status === "pending") {
      setMessageType("warning");
      setMessage("Your account is waiting for admin approval.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    
    if (member.status === "rejected") {
      setMessageType("error");
      setMessage("Your account has been rejected by the admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    
    if (member.status === "approved") {
      console.log("3. REDIRECTING");
      if (member.role === "admin") {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
      return;
    }

    setMessage("Login successful!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#022c22)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Sign In
        </h1>

        <p className="mb-7 text-center text-sm text-slate-400">
          Sign in to access your library account
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-5 text-right">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-center text-sm font-medium ${
              messageType === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : messageType === "warning"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Sign up
          </a>
        </p>

      </div>
    </main>
  );
}