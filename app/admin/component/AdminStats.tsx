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
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold">
          Total Books
        </h2>

        <p className="text-3xl font-bold mt-2">
          {totalBooks}
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold">
          Total Members
        </h2>

        <p className="text-3xl font-bold mt-2">
          {totalMembers}
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold">
          Currently Borrowed
        </h2>

        <p className="text-3xl font-bold mt-2">
          {borrowedBooks}
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold">
          Overdue
        </h2>

        <p className="text-3xl font-bold mt-2">
          {overdueBooks}
        </p>
      </div>

    </section>
  );
}