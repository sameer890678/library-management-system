"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Member = {
  id: number;
  name: string;
  student_id: string;
  email: string;
  phone: string;
  status: string;
};

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchPendingMembers();
  }, []);

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
    const { error } = await supabase
      .from("members")
      .update({ status: "approved" })
      .eq("id", id);
  
    if (error) {
      console.log(error);
      return;
    }
  
    fetchPendingMembers();
  };

  const rejectMember = async (id: number) => {
    const { error } = await supabase
      .from("members")
      .update({ status: "rejected" })
      .eq("id", id);
  
    if (error) {
      console.log(error);
      return;
    }
  
    fetchPendingMembers();
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Pending Signup Requests
        </h2>

        {members.length === 0 ? (
          <div className="border rounded-lg p-6">
            <p className="text-gray-500">
              No pending signup requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="border rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold">
                  {member.name}
                </h3>

                <p>Student ID: {member.student_id}</p>
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>

                <div className="mt-4">
                  <button
                    onClick={() => approveMember(member.id)}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg mr-2 cursor-pointer hover:bg-emerald-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectMember(member.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}