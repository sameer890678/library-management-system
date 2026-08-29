"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

;
type BorrowButtonProps = {
  bookId: number;
  bookTitle: string;
  canBorrow: boolean;
};

type Member = {
  name: string;
  student_id: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
};

export default function BorrowButton({
  bookId,
  bookTitle,
  canBorrow,
}: BorrowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMember, setLoadingMember] = useState(false);

  const openBorrowPopup = async () => {
    setIsOpen(true);
    setMessage("");
    setLoadingMember(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in to borrow a book.");
      setLoadingMember(false);
      return;
    }

    const { data, error } = await supabase
      .from("members")
      .select("name, student_id, email, phone, role, status")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log("MEMBER ERROR:", error);
      setMessage("Could not load your member information.");
      setLoadingMember(false);
      return;
    }

    setMember(data);
    setLoadingMember(false);
  };

  const handleBorrow = async () => {
    if (!member) {
      setMessage("Member information is not available.");
      return;
    }

    if (!dueDate) {
      setMessage("Please select a due date.");
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in to borrow a book.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.rpc("borrow_book", {
      p_book_id: bookId,
      p_due_date: dueDate,
    });

    if (error) {
      console.log("BORROW ERROR:", error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Book borrowed successfully!");
    setLoading(false);
    window.location.reload();

    setTimeout(() => {
      setIsOpen(false);
      setDueDate("");
      setMember(null);
      setMessage("");
    }, 1500);
  };

  return (
    <>
      {/* Borrow Button */}
      {canBorrow && (
          <button
            onClick={openBorrowPopup}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 hover:-translate-y-0.5 cursor-pointer"
          >
            Borrow Book
          </button>
        )}

      {/* Borrow Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6 text-white">
              Borrow Book
            </h2>

            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-slate-300">
              <p>
                <strong className="text-emerald-300">Book:</strong> {bookTitle}
              </p>
            </div>

            {loadingMember ? (
              <p className="py-4 text-center text-slate-400">Loading your information...</p>
            ) : member ? (
              <div className="mb-6 space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-slate-300">

                <p>
                  <strong className="text-slate-400">Name:</strong> {member.name}
                </p>

                <p>
                  <strong className="text-slate-400">Student ID:</strong>{" "}
                  {member.student_id || "Not available"}
                </p>

                <p>
                  <strong className="text-slate-400">Email:</strong>{" "}
                  {member.email || "Not available"}
                </p>

                <p>
                  <strong className="text-slate-400">Phone:</strong>{" "}
                  {member.phone || "Not available"}
                </p>

              </div>
            ) : null}

            <label className="block font-semibold mb-2 text-slate-300">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mb-5 w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-3 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />

            {message && (
              <p className="mb-4 text-center rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                {message}
              </p>
            )}

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setDueDate("");
                  setMember(null);
                  setMessage("");
                }}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 font-semibold text-white transition-all hover:bg-slate-600 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBorrow}
                disabled={loading || loadingMember}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Borrowing..." : "Confirm Borrow"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}