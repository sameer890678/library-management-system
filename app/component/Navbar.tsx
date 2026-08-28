"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type Member = {
  role: string;
  status: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      const currentUser = session?.user ?? null;
  
      setUser(currentUser);
  
      if (currentUser) {
        const { data, error } = await supabase
          .from("members")
          .select("role, status")
          .eq("user_id", currentUser.id)
          .single();
  
        if (error) {
          console.log("NAVBAR MEMBER ERROR:", error);
          setMember(null);
        } else {
          setMember(data);
        }
      } else {
        setMember(null);
      }
  
      
    };
  
    loadSession();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
  
        setUser(currentUser);
  
        if (!currentUser) {
          setMember(null);

          return;
        }
  
        const { data, error } = await supabase
          .from("members")
          .select("role, status")
          .eq("user_id", currentUser.id)
          .single();
  
        if (error) {
          console.log("NAVBAR MEMBER ERROR:", error);
          setMember(null);
        } else {
          setMember(data);
        }
  
       
      }
    );
  
    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const isAdmin =
    member?.role === "admin" &&
    member?.status === "approved";

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
    
      if (error) {
        console.log("LOGOUT ERROR:", error);
        return;
      }
    
      router.push("/");
      router.refresh();
    };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-md px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-white tracking-tight hover:text-emerald-400 transition-colors"
        >
          
          <div>
           <h1 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
          Library Management System
           </h1>
           <p className="text-xs text-slate-400">
             Digital Library
           </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">

          {/* Home */}
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </Link>

          {/* Normal User */}
          {user && !isAdmin && member?.status === "approved" && (
            <Link
              href="/my-borrowed-books"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/my-borrowed-books"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              My Borrowed Books
            </Link>
          )}

          {/* Admin */}
          {user && isAdmin && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/admin"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Admin
            </Link>
          )}

          {/* Logged Out */}
          {!user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-medium hover:bg-green-500/20 transition-all"
              >
                Signup
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all cursor-pointer"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}