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
  const [menuOpen, setMenuOpen] = useState(false);

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
  <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6 sm:py-4">
    <div className="mx-auto max-w-7xl">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="min-w-0"
        >
          <div>
            <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-xl">
              Library Management System
            </h1>

            <p className="text-xs text-slate-400">
              Digital Library
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm md:flex">

          {/* Home */}
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
                className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 font-medium text-white transition-all hover:bg-white/20"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 font-medium text-green-400 transition-all hover:bg-green-500/20"
              >
                Signup
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              Logout
            </button>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3 md:hidden">

          {/* Home */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </Link>

          {/* Normal User */}
          {user && !isAdmin && member?.status === "approved" && (
            <Link
              href="/my-borrowed-books"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                pathname === "/my-borrowed-books"
                  ? "bg-white/10 text-white"
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
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                pathname === "/admin"
                  ? "bg-white/10 text-white"
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
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition-all hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 font-medium text-green-400 transition-all hover:bg-green-500/20"
              >
                Signup
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-left font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              Logout
            </button>
          )}

        </div>
      )}

    </div>
  </nav>
);
}