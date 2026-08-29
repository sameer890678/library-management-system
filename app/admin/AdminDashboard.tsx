"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import AdminBorrowings from "./component/AdminBorrowings";
import AdminStats from "./component/AdminStats";

type Member = {
  id: number;
  name: string;
  student_id: string;
  email: string;
  phone: string;
  status: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    
    checkAdmin()
  }, []);
  
  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      router.push("/login");
      return;
    }
  
    const { data: member, error } = await supabase
      .from("members")
      .select("role, status")
      .eq("user_id", user.id)
      .single();
  
    if (error || !member) {
      router.push("/");
      return;
    }
  
    if (member.role !== "admin" || member.status !== "approved") {
      router.push("/");
      return;
    }
  
    fetchPendingMembers();
  };

  const fetchPendingMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status", "pending");

      console.log("PENDING MEMBERS:", data);
      console.log("MEMBERS ERROR:", error);

    if (error) {
      console.log(error);
      return;
    }

    setMembers(data || []);
  };

  

  const approveMember = async (id: number) => {
    setActionLoading(id);
    setActionMessage("");

    const { error } = await supabase
      .from("members")
      .update({ status: "approved" })
      .eq("id", id);
  
    if (error) {
      console.log(error);
      setActionMessage("Failed to approve member.");
      setActionLoading(null);
      return;
    }

    setActionMessage("Member approved successfully.");
    await fetchPendingMembers();
    setActionLoading(null);
  };

  const rejectMember = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this signup request?"
    );
  
    if (!confirmed) {
      return;
    }

    setActionLoading(id);
    setActionMessage("");

    const { error } = await supabase
      .from("members")
      .update({ status: "rejected" })
      .eq("id", id);
  
    if (error) {
      console.log(error);
      setActionMessage("Failed to reject member.");
      return;
    }
  
    setActionMessage("Member rejected successfully.");
    await fetchPendingMembers();
    setActionLoading(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-10">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Admin Dashboard
      </h1>

     <AdminStats />
      
      <section className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-xl">
        <h2 className="mb-6 text-3xl font-bold text-white">
          Pending Signup Requests
        </h2>

        {actionMessage && (
          <p className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
            {actionMessage}
          </p>
        )}

        {members.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
            <p className="text-slate-400">
              No pending signup requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-xl"
              >
                <h3 className="mb-4 text-xl font-bold text-white">
                  {member.name}
                </h3>

                <p className="mb-2 text-slate-300">
                  <strong className="text-slate-400">Student ID:</strong>{" "}
                  {member.student_id}
                </p>
                
                <p className="mb-2 text-slate-300">
                  <strong className="text-slate-400">Email:</strong>{" "}
                  {member.email}
                </p>
                
                <p className="mb-2 text-slate-300">
                  <strong className="text-slate-400">Phone:</strong>{" "}
                  {member.phone}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => approveMember(member.id)}
                    disabled={actionLoading !== null}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
                  >
                    {actionLoading === member.id ? "Approving..." : "Approve"}
                  </button>

                  <button
                    onClick={() => rejectMember(member.id)}
                    disabled={actionLoading !== null}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer"
                  >
                    {actionLoading === member.id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
     <AdminBorrowings /> 
    </main>
  );
}