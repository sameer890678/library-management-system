"use client";

import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BorrowButton from "./BorrowButton";


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
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState(true);
    const [isApprovedUser, setIsApprovedUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    useEffect(() => {
      const updateAuthState = async (session: any) => {
        const currentUser = session?.user ?? null;
    
        setUser(currentUser);
        setIsLoggedIn(!!currentUser);
    
        if (!currentUser) {
          setIsAdmin(false);
          setIsApprovedUser(false);
          setCheckingUser(false);

          return;
        }
    
        const { data: member, error } = await supabase
          .from("members")
          .select("role, status")
          .eq("user_id", currentUser.id)
          .single();
    
        if (error) {
          console.log("BOOK LIST MEMBER ERROR:", error);
          setIsAdmin(false);
          setIsApprovedUser(false);
        } else {
          setIsAdmin(
            member?.role === "admin" &&
            member?.status === "approved"
          );
          setIsApprovedUser(
            member?.role === "user" &&
            member?.status === "approved"
          );
        }
    
        setCheckingUser(false);
      };
    
      const loadSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
    
        updateAuthState(session);
      };
    
      loadSession();
    
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          updateAuthState(session);
        }
      );
    
      return () => {
        subscription.unsubscribe();
      };
    }, []);

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
    console.log("BOOK ID BEING UPDATED:", id);

    const { data: bookBefore, error: fetchError } = await supabase
      .from("books")
      .select("id, title")
      .eq("id", id)
      .single();
  
    console.log("IS LOGGED IN:", isLoggedIn);
    console.log("IS ADMIN:", isAdmin);
    console.log("FETCH ERROR:", fetchError);

    const { data, error } = await supabase
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
        .eq("id", id)
        .select();
  
      console.log("UPDATE DATA:", data);
      console.log("UPDATE ERROR:", error);

  if (error) {
    console.log("UPDATE ERROR", error);
    return;
  }

  seteditingId(null);
  router.refresh();
};

    const handleDelete = async (id: number) => {
      const { data: book, error: fetchError } = await supabase
        .from("books")
        .select("total_copies, available_copies")
        .eq("id", id)
        .single();
    
      if (fetchError || !book) {
        console.log("DELETE CHECK ERROR:", fetchError);
        return;
      }
    
      // Don't allow deletion if any copy is currently borrowed
      if (book.available_copies !== book.total_copies) {
        window.alert(
          "This book cannot be deleted because some copies are currently borrowed."
        );
        return;
      }
      
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

const displayedBooks = hasSearched ? searchResults : books;

const totalPages = Math.ceil(
  displayedBooks.length / booksPerPage
);

const startIndex = (currentPage - 1) * booksPerPage;

const currentBooks = displayedBooks.slice(
  startIndex,
  startIndex + booksPerPage
);

async function handleSearch() {
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
  setCurrentPage(1);
}

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-slate-800/60 p-5 shadow-xl backdrop-blur-md space-y-4">
        
      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-3">
      <input
       type="text"
       placeholder="Search books..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       className="flex-1 rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />

      <button
        onClick={handleSearch}
        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-[1.02] cursor-pointer"
    >
       Search
      </button>

      <button
       onClick={() => {
        setSearch("");
        setSearchResults([]);
        setHasSearched(false);
        setCurrentPage(1);
       }}
        className="rounded-xl border border-slate-600 bg-slate-700 px-5 py-3 font-semibold text-white transition-all hover:bg-slate-600 cursor-pointer"
       >
        Clear
       </button>

       <select
         value={category}
         onChange={(e) => setCategory(e.target.value)}
         className="rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500 cursor-pointer"
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
      </div>
      {/* Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
      {currentBooks.map((book) => (
        
        <div
          key={book.id}
        className="h-full bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col"
      >
        <h2 className="text-2xl font-semibold text-white mb-3">
         {editingId === book.id ? (
         <input
          type="text"
          value={editedTitle}
          className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-lg font-semibold text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        ) : (
        book.title
        )}
        </h2>

        <p className="text-slate-300 mb-2">
        <span className="text-slate-400">Author:</span>{" "}
       {editingId === book.id ? (
       <input
        type="text"
        value={editedAuthor}
        onChange={(e) => setEditedAuthor(e.target.value)}
        className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        ) : (
        book.author
        )}
        </p>

         <p className="text-slate-300 mb-2">
          <span className="text-slate-400">ISBN:</span>{" "}
          {editingId === book.id ? (
            <input
              type="text"
              value={editedIsbn}
              onChange={(e) => setEditedIsbn(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          ) : (
            book.isbn || "Not Available"
          )}
        </p>

        <p className="text-slate-300 mb-2">
          <span className="text-slate-400">Publisher:</span>{" "}
          {editingId === book.id ? (
            <input
              type="text"
              value={editedPublisher}
            onChange={(e) => setEditedPublisher(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        ) : (
          book.publisher || "Not Available"
        )}
        </p>

        <p className="text-slate-300 mb-2">
          <span className="text-slate-400">Publication Year:</span>{" "}
         {editingId === book.id ? (
           <input
                type="number"
                value={editedPublicationYear}
                onChange={(e) =>
                  setEditedPublicationYear(Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            ) : (
                book.publication_year || "Not Available"
            )}       
        </p>

        <p className="text-slate-300 mb-2">
          <span className="text-slate-400">Category:</span>{" "}
          {editingId === book.id ? (
            <input
              type="text"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          ) : (
            book.category
        )}
        </p>

        <p className="text-slate-300 mb-2">
          <span className="text-slate-400">Pages:</span>{" "}
          {editingId === book.id ? (
            <input
              type="number"
              value={editedPages}
              onChange={(e) => setEditedPages(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          ) : (
            book.pages
          )}
        </p>

        <p className="mt-4 text-slate-300">
          <span className="text-slate-400">Available Copies:</span>{" "}
          {editingId === book.id ? (
          <input
            type="number"
            value={editedAvailableCopies}
            onChange={(e) =>
              setEditedAvailableCopies(Number(e.target.value))
            }
            className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        ) : (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              book.available_copies > 0
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                : "bg-red-500/15 text-red-300 border border-red-500/20"
            }`}
          >
            {book.available_copies > 0
              ? `${book.available_copies} Available`
              : "Unavailable"}
          </span>
        )}
        </p>

        <p className="text-slate-300 mb-2">
          <span className="text-slate-400">Total Copies:</span>{" "}
          {editingId === book.id ? (
            <input
              type="number"
              value={editedTotalCopies}
              onChange={(e) =>
                setEditedTotalCopies(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
        ) : (
          book.total_copies
        )}
        </p>

    <div className="mt-auto border-t border-white/10 pt-4 space-y-2">

    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
      Library Actions
    </p>

    {isApprovedUser && (
      <BorrowButton
        bookId={book.id}
        bookTitle={book.title}
        canBorrow={isApprovedUser}
      />
    )}

     {isAdmin && (
      <>
       {editingId === book.id ? (
       <button
       type="button"
       onClick={() => handleUpdate(book.id)}
       className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-all cursor-pointer mr-2"
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
        type="button"
        className="rounded-lg bg-blue-500/15 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/25 transition-all cursor-pointer mr-2"
       >
        Edit
       </button>
      )}
      {editingId === book.id ? (
      <button
      type="button"
      onClick={() => seteditingId(null)}
      className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 transition-all cursor-pointer"
      >
      Cancel
     </button>
      ) : (
        <button 
        type="button"
        onClick={() => handleDelete(book.id)}
        className="rounded-lg bg-red-500/15 border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/25 transition-all cursor-pointer">
          Delete
        </button>
        )}
      </>
     )}
    </div>
    </div>
  ))}
  </div>

  {totalPages > 1 && (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4 flex-wrap">
  
      {/* Previous */}
      <button
        onClick={() =>
          setCurrentPage((page) => Math.max(page - 1, 1))
        }
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 cursor-pointer"
      >
        ←
      </button>
  
      {/* Page 1 */}
      <button
        onClick={() => setCurrentPage(1)}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1
            ? "bg-emerald-500 text-white"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        1
      </button>

      {/* Middle pages */}
      {currentPage > 3 && (
        <span className="px-2 text-white">...</span>
      )}
      
      {Array.from(
        { length: 3 },
        (_, i) => currentPage + i - 1
      )
        .filter(
          (page) =>
            page > 1 &&
            page < totalPages
        )
        .map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === page
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}

  
      {/* Dots */}
      {currentPage < totalPages - 3 && (
        <span className="px-2 text-white">
          ...
        </span>
      )}
  
      {/* Last page */}
      {totalPages > 1 && (
        <button
          onClick={() => setCurrentPage(totalPages)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-emerald-500 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
          }`}
        >
          {totalPages}
        </button>
      )}
  
      {/* Next */}
      <button
        onClick={() =>
          setCurrentPage((page) =>
            Math.min(page + 1, totalPages)
          )
        }
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 cursor-pointer"
      >
        →
      </button>
  
    </div>
  )}
 
    </div>
  );
  
}