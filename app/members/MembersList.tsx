"use client";

import { useState } from "react";

type Member = {
  id: number;
  name: string;
  student_id: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
};

type MembersListProps = {
  members: Member[];
};

export default function MembersList({ members }: MembersListProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      member.name?.toLowerCase().includes(searchText) ||
      member.student_id?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.phone?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "all" || member.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">

        <input
          type="text"
          placeholder="Search by name, student ID, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setRoleFilter("all");
            setStatusFilter("all");
          }}
          className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          Clear
        </button>

      </div>

      {/* Results Count */}
      <p className="mb-4 text-sm text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-200">
          {filteredMembers.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-200">
          {members.length}
        </span>{" "}
        members
      </p>

      {/* No Results */}
      {filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center shadow-lg">
          <p className="text-slate-400">
            No members match your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="mt-4 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Members Table */
        <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/60 shadow-xl">

          <table className="w-full text-left">

            <thead className="bg-slate-800/80">
              <tr>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Name
                </th>

                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Student ID
                </th>

                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </th>

                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Phone
                </th>

                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-slate-700/70 transition-colors hover:bg-slate-800/50"
                >
                  <td className="p-4 font-medium text-white">
                    {member.name}
                  </td>

                  <td className="p-4 text-slate-300">
                    {member.student_id || "N/A"}
                  </td>

                  <td className="p-4 text-slate-300">
                    {member.email || "N/A"}
                  </td>

                  <td className="p-4 text-slate-300">
                    {member.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        member.role === "admin"
                          ? "rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase text-purple-400"
                          : "rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase text-blue-400"
                      }
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        member.status === "approved"
                          ? "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase text-emerald-400"
                          : member.status === "pending"
                          ? "rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase text-yellow-400"
                          : "rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase text-red-400"
                      }
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </>
  );
}