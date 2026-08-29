"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminStats() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Total books
    const { count: booksCount, error: booksError } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });

    if (booksError) {
      console.log("BOOKS STATS ERROR:", booksError);
    }

    // Total members
    const { count: membersCount, error: membersError } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true });

    if (membersError) {
      console.log("MEMBERS STATS ERROR:", membersError);
    }

    // Currently borrowed books
    const { count: borrowedCount, error: borrowedError } = await supabase
      .from("borrowings")
      .select("*", { count: "exact", head: true })
      .eq("status", "borrowed");

    if (borrowedError) {
      console.log("BORROWED STATS ERROR:", borrowedError);
    }

    // Overdue books
    const today = new Date().toISOString();

    const { count: overdueCount, error: overdueError } = await supabase
      .from("borrowings")
      .select("*", { count: "exact", head: true })
      .eq("status", "borrowed")
      .lt("due_date", today);

    if (overdueError) {
      console.log("OVERDUE STATS ERROR:", overdueError);
    }

    setTotalBooks(booksCount ?? 0);
    setTotalMembers(membersCount ?? 0);
    setBorrowedBooks(borrowedCount ?? 0);
    setOverdueBooks(overdueCount ?? 0);
  };

  return (
    <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-2xl border border-blue-500/20 bg-slate-900/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Total Books
        </h2>

        <p className="mt-3 text-4xl font-bold text-blue-400">
          {totalBooks}
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/20 bg-slate-900/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Total Members
        </h2>

        <p className="mt-3 text-4xl font-bold text-purple-400">
          {totalMembers}
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Currently Borrowed
        </h2>

        <p className="mt-3 text-4xl font-bold text-emerald-400">
          {borrowedBooks}
        </p>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-slate-900/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-xl">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Overdue
        </h2>

        <p className="mt-3 text-4xl font-bold text-red-400">
          {overdueBooks}
        </p>
      </div>

    </section>
  );
}