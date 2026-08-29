"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          student_id: studentId,
          phone,
        },
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SESSION:", data.session);
    console.log("USER:", data.user);
    console.log("SIGNUP ERROR:", error);
  
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
  
    if (!data.user) {
      setMessage("Account could not be created.");
      setLoading(false);
      return;
    }
  
    setMessageType("success");
    setMessage(
      "Account created successfully! Your account is waiting for admin approval."
    );
  
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#022c22)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="mb-7 text-center text-sm text-slate-400">
          Create your library account
        </p>

        <form onSubmit={handleSignup}>
        
         <input
           type="text"
           placeholder="Full Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="mb-4 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
         />
         
         <input
           type="text"
           placeholder="Student ID"
           value={studentId}
           onChange={(e) => setStudentId(e.target.value)}
           className="mb-4 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
         />
 
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className="mb-4 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
         />
 
         <input
           type="text"
           placeholder="Phone"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
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

         <div className="relative mb-5">
           <input
             type={showPassword ? "text" : "password"}
             placeholder="Confirm Password"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
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
 
         <button
           type="submit"
           disabled={loading}
           className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
         >
           {loading ? "Creating Account..." : "Create Account"}
         </button>
        </form>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-center text-sm font-medium ${
              messageType === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {message}
          </div>
         )}

         <p className="mt-6 text-center text-sm text-slate-400">
           Already have an account?{" "}
           <a
             href="/login"
             className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
           >
             Sign in
           </a>
         </p>

      </div>
    </main>
  );
}