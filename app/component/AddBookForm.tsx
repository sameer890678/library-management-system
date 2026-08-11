"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AddBookForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [pages, setPages] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");
  const [message, setMessage] = useState("");

  const handleAddBook = async () => {
  const { data, error } = await supabase
    .from("books")
    .insert({
      title,
      author,
      isbn,
      category,
      publisher,
      publication_year: Number(publicationYear),
      pages: Number(pages),
      total_copies: Number(totalCopies),
      available_copies: Number(availableCopies),
    });

    if (error) {
    console.log(error);
    setMessage("Failed to add book.");
    return;
  }

  setMessage("Book added successfully!");
  router.refresh(); // Refresh the page to show the new book
};

  return (
    <div>
      <h2>Add New Book</h2>

      <input type="text" placeholder="Title" value={title}
       onChange={(e) => setTitle(e.target.value)} />
       
      <input type="text" placeholder="Author" value={author}
      onChange={(e) => setAuthor(e.target.value)} />

      <input type="text" placeholder="ISBN" value={isbn}
      onChange={(e) => setIsbn(e.target.value)} />

      <input type="text" placeholder="Category" value={category}
      onChange={(e) => setCategory(e.target.value)} />

      <input type="text" placeholder="Publisher" value={publisher}
      onChange={(e) => setPublisher(e.target.value)} />

      <input type="number" placeholder="Publication Year" value={publicationYear}
      onChange={(e) => setPublicationYear(e.target.value)} />

      <input type="number" placeholder="Pages" value={pages}
      onChange={(e) => setPages(e.target.value)} />

      <input type="number" placeholder="Total Copies" value={totalCopies}
       onChange={(e) => setTotalCopies(e.target.value)}/>

      <input type="number" placeholder="Available Copies" value={availableCopies}
       onChange={(e) => setAvailableCopies(e.target.value)} />

      <button className="bg-teal-500 border-black rounded-md px-4 py-2 hover:bg-teal-700 cursor-pointer text-black" onClick={handleAddBook}>Add Book</button>
      <p>{message}</p>
    </div>
  );
}