"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Member = {
  role: string;
  status: string;
};

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("members")
          .select("role, status")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.log("NAVBAR MEMBER ERROR:", error);
        }

        setMember(data);
      }

      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("LOGOUT ERROR:", error);
      return;
    }

    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <nav className="border-b p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Library Management System
          </Link>
        </div>
      </nav>
    );
  }

  const isAdmin =
    member?.role === "admin" &&
    member?.status === "approved";

  return (
    <nav className="border-b p-4">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Library Management System
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {/* Home */}
          <Link
            href="/"
            className="px-4 py-2 rounded-lg  hover:bg-gray-200"
          >
            Home
          </Link>

          {/* Normal User */}
          {user && !isAdmin && member?.status === "approved" && (
            <Link
              href="/my-borrowed-books"
              className="px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              My Borrowed Books
            </Link>
          )}

          {/* Admin */}
          {user && isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Admin
            </Link>
          )}

          {/* Logged Out */}
          {!user && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Signup
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}