"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setMessage(error.message);
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
    
    if (memberError || !member) {
      setMessage("Member account not found.");
      setLoading(false);
      return;
    }
    
    if (member.status === "pending") {
      setMessage("Your account is waiting for admin approval.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    
    if (member.status === "rejected") {
      setMessage("Your account has been rejected by the admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    
    if (member.status === "approved") {
      if (member.role === "admin") {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
      setLoading(false);
      return;
    }

    setMessage("Login successful!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Sign In
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 mb-4 w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 mb-4 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 w-full cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}