"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

;
type BorrowButtonProps = {
  bookId: number;
  bookTitle: string;
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
}: BorrowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMember, setLoadingMember] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [canBorrow, setCanBorrow] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      setUser(user);
      setCanBorrow(false);
  
      if (!user) {
        return;
      }
  
      const { data: memberData, error } = await supabase
        .from("members")
        .select("role, status")
        .eq("user_id", user.id)
        .single();
  
      if (error) {
        console.log("BORROW BUTTON MEMBER ERROR:", error);
        return;
      }
  
      if (
        memberData?.role === "user" &&
        memberData?.status === "approved"
      ) {
        setCanBorrow(true);
      }
    };
  
    checkUser();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
  
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-emerald-700 cursor-pointer"
          >
            Borrow Book
          </button>
        )}

      {/* Borrow Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-2xl font-bold mb-5 text-black">
              Borrow Book
            </h2>

            <div className="mb-4 text-black font-times">
              <p>
                <strong>Book:</strong> {bookTitle}
              </p>
            </div>

            {loadingMember ? (
              <p className="text-black">Loading your information...</p>
            ) : member ? (
              <div className="space-y-2 mb-5 text-black">

                <p>
                  <strong>Name:</strong> {member.name}
                </p>

                <p>
                  <strong>Student ID:</strong>{" "}
                  {member.student_id || "Not available"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {member.email || "Not available"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {member.phone || "Not available"}
                </p>

              </div>
            ) : null}

            <label className="block font-medium mb-2 text-black">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mb-4 text-black"
            />

            {message && (
              <p className="mb-4 text-center">
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
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBorrow}
                disabled={loading || loadingMember}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
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