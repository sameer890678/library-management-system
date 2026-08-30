"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";


type Borrowing = {
  id: number;
  user_id: string;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  members: {
    name: string;
    student_id: string;
    email: string;
  } | null;
  books: {
    title: string;
    author: string;
  } | null;
};

export default function AdminBorrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    const { data, error } = await supabase
      .from("borrowings")
      .select(`
        id,
        user_id,
        book_id,
        borrow_date,
        due_date,
        return_date,
        status,
        members (
          name,
          student_id,
          email
        ),
        books (
          title,
          author
        )
      `)
      .order("borrow_date", { ascending: false });

    if (error) {
      console.log("ADMIN BORROWINGS ERROR:", error);
      setLoading(false);
      return;
    }

    setBorrowings((data ?? []) as unknown as Borrowing[]);
    setLoading(false);
  };

  const filteredBorrowings = borrowings.filter((borrowing) => {
    const searchText = search.toLowerCase().trim();
  
    const matchesSearch =
      borrowing.members?.name?.toLowerCase().includes(searchText) ||
      borrowing.members?.student_id?.toLowerCase().includes(searchText) ||
      borrowing.members?.email?.toLowerCase().includes(searchText) ||
      borrowing.books?.title?.toLowerCase().includes(searchText) ||
      borrowing.books?.author?.toLowerCase().includes(searchText);
  
    const matchesFilter =
      filter === "all" ||
      (filter === "borrowed" && borrowing.status === "borrowed") ||
      (filter === "returned" && borrowing.status === "returned") ||
      (filter === "overdue" &&
        borrowing.status === "borrowed" &&
        new Date(borrowing.due_date) < new Date());
  
    return matchesSearch && matchesFilter;
  });

  const returnBook = async (borrowingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this book as returned?"
    );
  
    if (!confirmed) {
      return;
    }
  
    const { error } = await supabase.rpc("return_book", {
      p_borrowing_id: borrowingId,
    });
  
    if (error) {
      console.log("RETURN BOOK ERROR:", error);
      alert(error.message);
      return;
    }
  
    alert("Book returned successfully!");
  
    fetchBorrowings();
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold text-white">
        Borrowing Records
      </h2>

      <input
        type="text"
        placeholder="Search by name, student ID, email, book, or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />

    <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "border-slate-400 bg-slate-600 text-white shadow-md"
              : "border-slate-600 bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          All
        </button>
      
        <button
          onClick={() => setFilter("borrowed")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "borrowed"
              ? "border-blue-400/50 bg-blue-500/20 text-blue-300 shadow-md"
              : "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          }`}
        >
          Borrowed
        </button>
      
        <button
          onClick={() => setFilter("returned")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "returned"
              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-md"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          Returned
        </button>
      
        <button
          onClick={() => setFilter("overdue")}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "overdue"
              ? "border-red-400/50 bg-red-500/20 text-red-300 shadow-md"
              : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          }`}
        >
          Overdue
        </button>
      
      </div>

      {loading ? (
        <p>Loading borrowing records...</p>
      ) : filteredBorrowings.length === 0 ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 text-center shadow-lg">
          <p className="text-slate-400">
            No borrowing records match your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {filteredBorrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-xl"
            >

              <h3 className="mb-4 text-xl font-bold text-white">
                {borrowing.books?.title || "Unknown Book"}
              </h3>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Author:</strong>{" "}
                {borrowing.books?.author || "Unknown"}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Borrowed By:</strong>{" "}
                {borrowing.members?.name || "Unknown"}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Student ID:</strong>{" "}
                {borrowing.members?.student_id || "Unknown"}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Email:</strong>{" "}
                {borrowing.members?.email || "Unknown"}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Borrow Date:</strong>{" "}
                {new Date(
                  borrowing.borrow_date
                ).toLocaleDateString()}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Due Date:</strong>{" "}
                {new Date(
                  borrowing.due_date
                ).toLocaleDateString()}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Return Date:</strong>{" "}
                {borrowing.return_date
                  ? new Date(borrowing.return_date).toLocaleDateString()
                  : "Not returned yet"}
              </p>

              <p className="mb-2 text-slate-300">
                <strong className="text-slate-400">Status:</strong>{" "}
                {borrowing.status === "borrowed" &&
                new Date(borrowing.due_date) < new Date() ? (
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                    OVERDUE
                  </span>
                ) : borrowing.status === "returned" ? (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    RETURNED
                  </span>
                ) : (
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                    BORROWED
                  </span>
                )}
              </p>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}