"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Borrowing = {
  id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  books: {
    title: string;
    author: string;
  } | null;
};

export default function MyBorrowedBooks() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadBorrowings = async () => {
      setLoading(true);
      setMessage("");
  
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      const user = session?.user;
  
      if (!user) {
        setMessage("Please log in to view your borrowed books.");
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from("borrowings")
        .select(`
          id,
          book_id,
          borrow_date,
          due_date,
          return_date,
          status,
          books (
            title,
            author
          )
        `)
        .eq("user_id", user.id)
        .order("borrow_date", { ascending: false });
  
      if (error) {
        console.log("BORROWINGS ERROR:", error);
        setMessage("Failed to load your borrowed books.");
        setLoading(false);
        return;
      }
  
      setBorrowings(data as unknown as Borrowing[]);
      setLoading(false);
    };
  
    loadBorrowings();
  }, []);

  const handleReturn = async (borrowingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );
  
    if (!confirmed) {
      return;
    }
  
    const { error } = await supabase.rpc("return_book", {
      p_borrowing_id: borrowingId,
    });
  
    if (error) {
      console.log("RETURN ERROR:", error);
      setMessage(error.message);
      return;
    }
  
    setMessage("Book returned successfully!");
  
    window.location.reload();
  };

  const filteredBorrowings = borrowings.filter((borrowing) => {
    const isOverdue =
      borrowing.status === "borrowed" &&
      new Date(borrowing.due_date) < new Date();
  
    if (filter === "overdue") {
      return isOverdue;
    }
  
    if (filter === "borrowed") {
      return borrowing.status === "borrowed" && !isOverdue;
    }
  
    if (filter === "returned") {
      return borrowing.status === "returned";
    }
  
    return true;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#022c22)] px-4 py-8 sm:px-6 md:px-10">

      <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl">
        My Borrowed Books
      </h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "all"
              ? "border border-slate-400 bg-slate-600 text-white shadow-md"
              : "border border-slate-700 bg-slate-900/70 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          All
        </button>
      
        <button
          type="button"
          onClick={() => setFilter("borrowed")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "borrowed"
              ? "border border-blue-400/50 bg-blue-500/20 text-blue-300 shadow-md"
              : "border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          }`}
        >
          Borrowed
        </button>
      
        <button
          type="button"
          onClick={() => setFilter("returned")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "returned"
              ? "border border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-md"
              : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          Returned
        </button>
      
        <button
          type="button"
          onClick={() => setFilter("overdue")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            filter === "overdue"
              ? "border border-red-400/50 bg-red-500/20 text-red-300 shadow-md"
              : "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          }`}
        >
          Overdue
        </button>
      
      </div>



      {loading && (
        <p className="text-slate-400">Loading your borrowed books...</p>
      )}

      {!loading && message && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {message}
        </p>
      )}

      {!loading && !message && borrowings.length === 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center">
          <p className="text-slate-400">
            You haven't borrowed any books yet.
          </p>
        </div>
      )}

      {!loading &&
       !message &&
       borrowings.length > 0 &&
       filteredBorrowings.length === 0 && (
         <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center shadow-lg">
           <p className="text-slate-400">
             No books match this filter.
           </p>
     
           <button
             type="button"
             onClick={() => setFilter("all")}
             className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
           >
             Show All Books
           </button>
         </div>
       )}

      {!loading && filteredBorrowings.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {filteredBorrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl"
            >

              <h2 className="text-2xl font-bold mb-4 text-white">
                {borrowing.books?.title || "Unknown Book"}
              </h2>

              <p className="mb-2 text-sm text-slate-300 sm:text-base">
                <strong>Author:</strong>{" "}
                {borrowing.books?.author || "Unknown"}
              </p>

              <p className="mb-2 text-sm text-slate-300 sm:text-base">
                <strong>Borrow Date:</strong>{" "}
                {new Date(
                  borrowing.borrow_date
                ).toLocaleDateString()}
              </p>

              <p className="mb-2 text-sm text-slate-300 sm:text-base">
                <strong>Due Date:</strong>{" "}
                {new Date(
                  borrowing.due_date
                ).toLocaleDateString()}
              </p>

              <p className="mb-2 text-sm text-slate-300 sm:text-base">
                <strong>Return Date:</strong>{" "}
                {borrowing.return_date
                  ? new Date(borrowing.return_date).toLocaleDateString()
                  : "Not returned yet"}
              </p>

              <p className="mb-2 text-sm text-slate-300 sm:text-base">
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

              {borrowing.status === "borrowed" && (
                <button
                  onClick={() => handleReturn(borrowing.id)}
                  className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition-all hover:bg-red-500/20 cursor-pointer"
                >
                  Return Book
                </button>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  );
}