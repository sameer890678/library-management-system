"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent."
    );

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-900 bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#022c22)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Forgot Password?
        </h1>

        <p className="mb-7 text-center text-sm text-slate-400">
          Enter your email and we'll send you a password reset link.
        </p>

        <form onSubmit={handleReset}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-5 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-400 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <p className="mt-4 rounded-lg bg-slate-900/60 px-3 py-2 text-center text-sm text-slate-300">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}