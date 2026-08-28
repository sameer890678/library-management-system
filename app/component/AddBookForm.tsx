"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AddBookForm() {
  const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [checkingUser, setCheckingUser] = useState(true);

    
  //FOR MEMBER CHECK
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      await updateUser(session);
    };
  
    const updateUser = async (session: any) => {
      const currentUser = session?.user ?? null;
  
      setUser(currentUser);
  
      if (!currentUser) {
        setIsAdmin(false);
        setCheckingUser(false);
        return;
      }
  
      const { data: member, error } = await supabase
        .from("members")
        .select("role, status")
        .eq("user_id", currentUser.id)
        .single();
  
      if (error) {
        console.log("ADD BOOK MEMBER ERROR:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(
          member?.role === "admin" &&
          member?.status === "approved"
        );
      }
  
      setCheckingUser(false);
    };
  
    loadUser();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateUser(session);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

 if (checkingUser) {
   return null;
 }
 
 if (!user || !isAdmin) {
   return null;
 }

  return (
    <>
      {isAdmin && (
        <div className="mt-8 space-y-4 mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Add New Book
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="text"
            placeholder="Publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="number"
            placeholder="Publication Year"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="number"
            placeholder="Pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="number"
            placeholder="Total Copies"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <input
            type="number"
            placeholder="Available Copies"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <button
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] hover:shadow-emerald-500/30 cursor-pointer"
            onClick={handleAddBook}
          >
            Add Book
          </button>
          <p className="text-center text-sm text-emerald-400">
            {message}</p>
        </div>
      )}
    </>
  );
}