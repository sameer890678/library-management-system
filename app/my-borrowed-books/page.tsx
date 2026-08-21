"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Borrowing = {
  id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
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

  useEffect(() => {
    const loadBorrowings = async () => {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

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

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-4xl font-bold mb-6">
        My Borrowed Books
      </h1>

      {loading && (
        <p>Loading your borrowed books...</p>
      )}

      {!loading && message && (
        <p className="text-red-600">
          {message}
        </p>
      )}

      {!loading && !message && borrowings.length === 0 && (
        <p>
          You haven't borrowed any books yet.
        </p>
      )}

      {!loading && borrowings.length > 0 && (
        <div className="space-y-4">

          {borrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="border rounded-lg p-5"
            >

              <h2 className="text-2xl font-semibold mb-2">
                {borrowing.books?.title || "Unknown Book"}
              </h2>

              <p>
                <strong>Author:</strong>{" "}
                {borrowing.books?.author || "Unknown"}
              </p>

              <p>
                <strong>Borrow Date:</strong>{" "}
                {new Date(
                  borrowing.borrow_date
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(
                  borrowing.due_date
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {borrowing.status}
              </p>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}