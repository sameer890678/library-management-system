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

  return (
    <section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Borrowing Records
      </h2>

      <input
        type="text"
        placeholder="Search by name, student ID, email, book, or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full mb-4"
      />

    <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          All
        </button>
      
        <button
          onClick={() => setFilter("borrowed")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Borrowed
        </button>
      
        <button
          onClick={() => setFilter("returned")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Returned
        </button>
      
        <button
          onClick={() => setFilter("overdue")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
        >
          Overdue
        </button>
      
      </div>

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

          {filteredBorrowings.map((borrowing) => (
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