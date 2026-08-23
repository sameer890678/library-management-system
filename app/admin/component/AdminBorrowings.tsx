"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Borrowing = {
  id: number;
  user_id: string;
  book_id: number;
  borrow_date: string;
  due_date: string;
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

  return (
    <section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Borrowing Records
      </h2>

      {loading ? (
        <p>Loading borrowing records...</p>
      ) : borrowings.length === 0 ? (
        <div className="border rounded-lg p-6">
          <p className="text-gray-500">
            No borrowing records found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {borrowings.map((borrowing) => (
            <div
              key={borrowing.id}
              className="border rounded-lg p-6"
            >

              <h3 className="text-xl font-semibold mb-2">
                {borrowing.books?.title || "Unknown Book"}
              </h3>

              <p>
                <strong>Author:</strong>{" "}
                {borrowing.books?.author || "Unknown"}
              </p>

              <p>
                <strong>Borrowed By:</strong>{" "}
                {borrowing.members?.name || "Unknown"}
              </p>

              <p>
                <strong>Student ID:</strong>{" "}
                {borrowing.members?.student_id || "Unknown"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {borrowing.members?.email || "Unknown"}
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
                {borrowing.status === "borrowed" &&
                new Date(borrowing.due_date) < new Date() ? (
                  <span className="text-red-600 font-bold">
                    OVERDUE
                  </span>
                ) : (
                  borrowing.status
                )}
              </p>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}