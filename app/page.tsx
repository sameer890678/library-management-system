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
     <main className="min-h-screen p-10">
    <Navbar />
    <AddBookForm />
    <BookList books={data ?? []} />
  </main>
  );
}

function order(arg0: string, arg1: { ascending: boolean; }) {
  throw new Error("Function not implemented.");
}
