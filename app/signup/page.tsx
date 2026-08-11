"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setLoading(true);
    setMessage("");
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
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
  
    const { error: memberError } = await supabase
      .from("members")
      .insert({
        user_id: data.user.id,
        name,
        student_id: studentId,
        email,
        phone,
        status: "pending",
      });
  
    if (memberError) {
      console.log("MEMBER ERROR:", memberError);
      setMessage("Account created, but member profile could not be created.");
      setLoading(false);
      return;
    }
  
    setMessage(
      "Account created successfully! Your account is waiting for admin approval."
    );
  
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="border rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSignup}>
        
         <input
           type="text"
           placeholder="Full Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="border rounded-lg px-3 py-2 mb-4 w-full"
         />
         
         <input
           type="text"
           placeholder="Student ID"
           value={studentId}
           onChange={(e) => setStudentId(e.target.value)}
           className="border rounded-lg px-3 py-2 mb-4 w-full"
         />
 
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className="border rounded-lg px-3 py-2 mb-4 w-full"
         />
 
         <input
           type="text"
           placeholder="Phone"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
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
           {loading ? "Creating Account..." : "Create Account"}
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