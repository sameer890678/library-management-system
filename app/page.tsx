import { supabase } from "@/lib/supabase";
import AddBookForm from "./component/AddBookForm";

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
    {data?.map((book) => (
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
      </div>
    ))}
  </main>
  );
}