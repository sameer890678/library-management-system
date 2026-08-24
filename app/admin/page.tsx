import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase-server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member, error } = await supabase
    .from("members")
    .select("role, status")
    .eq("user_id", user.id)
    .single();

  if (
    error ||
    !member ||
    member.role !== "admin" ||
    member.status !== "approved"
  ) {
    redirect("/");
  }

  return <AdminDashboard />;
}