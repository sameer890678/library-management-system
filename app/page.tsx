import { supabase } from "@/lib/supabase";
import AddBookForm from "./component/AddBookForm";
import BookList from "./component/BookList";

export default async function Home() {
  const { data, error } = await supabase
    .from("books")
    .select("*");

  console.log(data);
  console.log(error);

  return (
     <main className="min-h-screen p-10">
    <h1 className="text-4xl font-bold mb-6">
      Library Books
    </h1>
    <AddBookForm />
    <BookList books={data ?? []} />
  </main>
  );
}