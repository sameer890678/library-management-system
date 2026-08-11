import { supabase } from "../../lib/supabase";

export default async function MembersPage() {
  const { data, error } = await supabase
    .from("members")
    .select("*");

  console.log("MEMBERS DATA:", data);
  console.log("MEMBERS ERROR:", error);

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">
        Library Members
      </h1>
    </main>
  );
}