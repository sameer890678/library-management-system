import { supabase } from "@/lib/supabase";
import AddBookForm from "./component/AddBookForm";
import BookList from "./component/BookList";
import Navbar from "./component/Navbar";

export default async function Home() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("title", { ascending: true });

  console.log(data);
  console.log(error);

  return (
     <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(20,184,166,0.15),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_50%,_#022c22)]">
    <Navbar />
     <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
       {/* Hero Section */}
       <div className="mb-10">
         <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Library Management System
         </p>
         <h1 className="text-4xl font-extrabold tracking-tight text-white-900 sm:text-5xl">
          Explore Our Library
         </h1>
         <p className="mt-3 max-w-2xl text-lg text-gray-600">
          Discover books, check availability, and borrow your next great read.
         </p>
       </div>

       {/* Admin Add Book Section */}
       <AddBookForm />

       {/* Books */}
       <section className="mt-10">
        <BookList books={data ?? []} />
       </section>

     </section>
      
  </main>
  );
}
