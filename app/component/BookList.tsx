"use client";

import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  category: string;
  pages: number;
  total_copies: number;
  available_copies: number;
};

type BookListProps = {
  books: Book[];
};

export default function BookList({ books }: BookListProps) {
    const router = useRouter();

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
  "Are you sure you want to delete this book?"
);

if (!confirmed) {
  return;
}
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  router.refresh();
};

  return (
    <div>
      {books?.map((book) => (
        <div
          key={book.id}
        className="border rounded-lg p-4 mb-4"
      >
        <h2 className="text-2xl font-semibold">
          {book.title}
        </h2>

        <p>Author: {book.author}</p>
        <p>ISBN: {book.isbn || "Not Available"}</p>
        <p>Publisher: {book.publisher || "Not Available"}</p>
        <p>Category: {book.category}</p>
        <p>Pages: {book.pages}</p>
        <p>
          Available: {book.available_copies} / {book.total_copies}
        </p>
        <button 
        onClick={() => handleDelete(book.id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-red-800">
          Delete
        </button>
      </div>
    ))}
    </div>
    );
    }