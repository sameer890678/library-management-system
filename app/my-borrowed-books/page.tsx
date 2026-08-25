import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase-server";
import MyBorrowedBooks from "./MyBorrowedBooks";

export default async function MyBorrowedBooksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    redirect("/login");
  }

  // Get member information
  const { data: member, error } = await supabase
    .from("members")
    .select("role, status")
    .eq("user_id", user.id)
    .single();

  // Only approved normal users can access this page
  if (
    error ||
    !member ||
    member.role !== "user" ||
    member.status !== "approved"
  ) {
    redirect("/");
  }

  return <MyBorrowedBooks />;
}