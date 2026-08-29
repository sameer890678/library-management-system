import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase-server";

type Member = {
  id: number;
  name: string;
  student_id: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
};

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

      {!members || members.length === 0 ? (
        <div className="border rounded-lg p-6">
          <p className="text-gray-500">
            No registered members found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {member.name}
                  </td>

                  <td className="p-4">
                    {member.student_id || "N/A"}
                  </td>

                  <td className="p-4">
                    {member.email || "N/A"}
                  </td>

                  <td className="p-4">
                    {member.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    {member.role}
                  </td>

                  <td className="p-4">
                    {member.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}