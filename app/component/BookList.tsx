"use client";

import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  publication_year: number | null;
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
    const [editingId, seteditingId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedAuthor, setEditedAuthor] = useState("");
    const [editedIsbn, setEditedIsbn] = useState("");
    const [editedPublisher, setEditedPublisher] = useState("");
    const [editedPublicationYear, setEditedPublicationYear] = useState(0);
    const [editedCategory, setEditedCategory] = useState("");
    const [editedPages, setEditedPages] = useState(0);
    const [editedTotalCopies, setEditedTotalCopies] = useState(0);
    const [editedAvailableCopies, setEditedAvailableCopies] = useState(0);

    const handleUpdate = async (id: number) => {
    const { error } = await supabase
    .from("books")
    .update({
      title: editedTitle,
      author: editedAuthor,
      isbn: editedIsbn,
      publisher: editedPublisher,
      publication_year: editedPublicationYear,
      category: editedCategory,
      pages: editedPages,
      total_copies: editedTotalCopies,
      available_copies: editedAvailableCopies,
    })
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  seteditingId(null);
  router.refresh();
};

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
         {editingId === book.id ? (
         <input
          type="text"
          value={editedTitle}
          className="border rounded px-2 py-1"
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        ) : (
        book.title
        )}
        </h2>

        <p>
        Author:{" "}
       {editingId === book.id ? (
       <input
        type="text"
        value={editedAuthor}
        onChange={(e) => setEditedAuthor(e.target.value)}
        className="border rounded px-2 py-1"
        />
        ) : (
        book.author
        )}
        </p>

         <p>
          ISBN:{" "}
          {editingId === book.id ? (
            <input
              type="text"
              value={editedIsbn}
              onChange={(e) => setEditedIsbn(e.target.value)}
              className="border rounded px-2 py-1"
            />
          ) : (
            book.isbn || "Not Available"
          )}
        </p>

        <p>
        Publisher:{" "}
        {editingId === book.id ? (
          <input
            type="text"
            value={editedPublisher}
            onChange={(e) => setEditedPublisher(e.target.value)}
            className="border rounded px-2 py-1"
          />
        ) : (
          book.publisher || "Not Available"
        )}
        </p>

        <p>
         Publication Year:{" "}
         {editingId === book.id ? (
           <input
                type="number"
                value={editedPublicationYear}
                onChange={(e) =>
                  setEditedPublicationYear(Number(e.target.value))
                }
                className="border rounded px-2 py-1"
              />
            ) : (
                book.publication_year || "Not Available"
            )}       
        </p>

        <p>
        Category:{" "}
        {editingId === book.id ? (
          <input
            type="text"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="border rounded px-2 py-1"
          />
        ) : (
          book.category
        )}
        </p>

        <p>
        Pages:{" "}
        {editingId === book.id ? (
          <input
            type="number"
            value={editedPages}
            onChange={(e) => setEditedPages(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        ) : (
          book.pages
        )}
        </p>

        <p>
        Available Copies:{" "}
        {editingId === book.id ? (
          <input
            type="number"
            value={editedAvailableCopies}
            onChange={(e) =>
              setEditedAvailableCopies(Number(e.target.value))
            }
            className="border rounded px-2 py-1"
          />
        ) : (
          book.available_copies
        )}
        </p>

        <p>
        Total Copies:{" "}
        {editingId === book.id ? (
          <input
            type="number"
            value={editedTotalCopies}
            onChange={(e) =>
              setEditedTotalCopies(Number(e.target.value))
            }
            className="border rounded px-2 py-1"
          />
        ) : (
          book.total_copies
        )}
        </p>

       {editingId === book.id ? (
       <button
       onClick={() => handleUpdate(book.id)}
       className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 mr-2 hover:bg-green-700"
       >
        Save
       </button>
       ) : (
       <button
        onClick={() => {
        seteditingId(book.id);
        setEditedTitle(book.title);
        setEditedAuthor(book.author);
        setEditedIsbn(book.isbn ?? "");
        setEditedPublisher(book.publisher ?? "");
        setEditedPublicationYear(book.publication_year ?? 0);
        setEditedCategory(book.category);
        setEditedPages(book.pages);
        setEditedTotalCopies(book.total_copies);
        setEditedAvailableCopies(book.available_copies);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 mr-2 hover:bg-blue-700"
       >
        Edit
       </button>
      )}
      {editingId === book.id ? (
      <button
      onClick={() => seteditingId(null)}
      className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-gray-700"
      >
      Cancel
     </button>
      ) : (
        <button 
        onClick={() => handleDelete(book.id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-red-800">
          Delete
        </button>
        )}
      </div>
    ))}
    </div>
    );
    }