"use client";

import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


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
    const [search, setSearch] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
    const getCategories = async () => {
     const { data, error } = await supabase
       .from("books")
       .select("category");

     if (error) {
       console.log(error);
       return;
     }

     const uniqueCategories = [
       ...new Set(
         data
           .map((book) => book.category?.trim())
           .filter((category) => category)
       ),
     ];

    setCategories(uniqueCategories);
    };

    getCategories();
    }, []);

    const [searchResults, setSearchResults] = useState<Book[]>([]);
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

const handleSearch = async () => {
  let query = supabase
    .from("books")
    .select("*");

  if (search.trim() !== "") {
    query = query.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`
    );
  }

  if (category !== "") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    return;
  }

  setSearchResults(data);
  setHasSearched(true);
};

  return (
    <div>
        
      {/* Search */}
      <input
       type="text"
       placeholder="Search books..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       className="border rounded-lg px-4 py-2 mb-6 w-full"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 ml-2 hover:bg-blue-700 cursor-pointer"
    >
       Search
      </button>

      <button
       onClick={() => {
        setSearch("");
        setSearchResults([]);
        setHasSearched(false);
       }}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-6 ml-2 hover:bg-gray-700 cursor-pointer"
       >
        Clear
       </button>

       <select
         value={category}
         onChange={(e) => setCategory(e.target.value)}
         className="border rounded-lg px-4 py-2 mb-6 ml-2 bg-emerald-200 text-black cursor-pointer"
       >
         <option value="" className="bg-white text-black">
           All Categories
         </option>
       
         {categories.map((cat) => (
           <option
             key={cat}
             value={cat}
             className="bg-white text-black"
           >
             {cat}
           </option>
         ))}
       </select>
      
      {/* Books */}
      {(hasSearched ? searchResults : books)?.map((book) => (
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
       className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 mr-2 hover:bg-green-700 cursor-pointer"
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
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 mr-2 hover:bg-blue-700 cursor-pointer"
       >
        Edit
       </button>
      )}
      {editingId === book.id ? (
      <button
      onClick={() => seteditingId(null)}
      className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-gray-700 cursor-pointer"
      >
      Cancel
     </button>
      ) : (
        <button 
        onClick={() => handleDelete(book.id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer hover:bg-red-800 cursor-pointer">
          Delete
        </button>
        )}
      </div>
    ))}
    </div>
    );
    }