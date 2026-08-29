import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase-server";
import MembersList from "./MembersList";

export default async function MembersPage() {
  const supabase = await createClient();

  // Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    redirect("/login");
  }

  // Check member role and status
  const { data: currentMember, error: currentMemberError } =
    await supabase
      .from("members")
      .select("role, status")
      .eq("user_id", user.id)
      .single();

  // Only approved admins can access this page
  if (
    currentMemberError ||
    !currentMember ||
    currentMember.role !== "admin" ||
    currentMember.status !== "approved"
  ) {
    redirect("/");
  }

  // Get all registered members
  const { data: members, error } = await supabase
    .from("members")
    .select(
      "id, name, student_id, email, phone, role, status"
    )
    .order("name", { ascending: true });

  if (error) {
    console.log("MEMBERS ERROR:", error);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Library Members
      </h1>

      <MembersList members={members || []} />
    </main>
  );
}