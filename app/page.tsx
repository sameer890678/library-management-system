import { supabase } from "@/lib/supabase";
import AddBookForm from "./component/AddBookForm";
import BookList from "./component/BookList";
import Navbar from "./component/Navbar";

export default async function Home() {
  const { data, error } = await supabase
    .from("books")
    .select("*");

  console.log(data);
  console.log(error);

  return (
     <main className="min-h-screen p-10">
    <Navbar />
    <AddBookForm />
    <BookList books={data ?? []} />
  </main>
  );
}