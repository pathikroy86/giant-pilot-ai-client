"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { DashboardHeader, StatCard, StatusPill } from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";

function approvalTone(status) {
  if (status === "approved") return "green";
  if (status === "rejected") return "slate";
  return "amber";
}

export default function AdminDashboard() {
  const [grants, setGrants] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadAdminData = useCallback(async () => {
    const token = localStorage.getItem("grantpilot_auth_token");

    if (!token) {
      setStatus("error");
      setMessage("Sign in as admin to load approval data.");
      return;
    }

    try {
      setStatus("loading");
      const headers = { authorization: `Bearer ${token}` };
      const [grantsResponse, statsResponse] = await Promise.all([
        fetch(`${getApiBaseUrl()}/api/admin/grants`, { headers }),
        fetch(`${getApiBaseUrl()}/api/admin/stats`, { headers }),
      ]);
      const [grantsData, statsData] = await Promise.all([
        grantsResponse.json(),
        statsResponse.json(),
      ]);

      if (!grantsResponse.ok) {
        throw new Error(grantsData.message || "Could not load grants");
      }

      if (!statsResponse.ok) {
        throw new Error(statsData.message || "Could not load stats");
      }

      setGrants(grantsData);
      setStats(statsData);
      setStatus("success");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadAdminData, 0);
    return () => window.clearTimeout(timer);
  }, [loadAdminData]);

  const updateApproval = async (grantId, approvalStatus) => {
    const token = localStorage.getItem("grantpilot_auth_token");
    setMessage("");

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/admin/grants/${grantId}/approval`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update approval");
      }

      setGrants((current) =>
        current.map((grant) => (grant._id === grantId ? data.grant : grant))
      );
      await loadAdminData();
      setMessage(`Grant marked as ${approvalStatus}.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const pendingGrants = useMemo(() => {
    return grants.filter((grant) => (grant.approvalStatus || "pending") === "pending");
  }, [grants]);

  const categories = useMemo(() => {
    return new Set(grants.map((grant) => grant.category).filter(Boolean)).size;
  }, [grants]);

  return (
    <RoleGate allowedRoles={["admin"]}>
      <DashboardHeader
        eyebrow="Admin dashboard"
        title="Review grants before they go public."
        description="Every grant must be approved by admin before it appears on the landing page, Explore page, or grant seeker dashboard."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Stored grants" value={status === "loading" ? "..." : stats?.grants?.total || 0} detail="All MongoDB grant records" />
        <StatCard label="Approved" value={stats?.grants?.approved || 0} detail="Visible in public UI" />
        <StatCard label="Pending review" value={stats?.grants?.pending || 0} detail="Hidden until approved" />
        <StatCard label="Categories" value={categories || 0} detail="Funding areas represented" />
      </div>

      {message ? (
        <p className="mt-6 rounded-lg bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
          {message}
        </p>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">Grant approval queue</h2>
            <p className="mt-2 text-sm text-slate-500">
              Pending grants are not returned by the public grants API.
            </p>
          </div>
          <StatusPill tone="amber">{pendingGrants.length} pending</StatusPill>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Grant</th>
                <th className="px-4 py-3">Funder</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {grants.map((grant) => {
                const currentStatus = grant.approvalStatus || "pending";

                return (
                  <tr key={grant._id}>
                    <td className="px-4 py-4">
                      <p className="font-bold text-blue-950">{grant.title}</p>
                      <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                        {grant.summary}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{grant.funder}</td>
                    <td className="px-4 py-4 text-slate-600">{grant.category}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{grant.amount}</td>
                    <td className="px-4 py-4">
                      <StatusPill tone={approvalTone(currentStatus)}>
                        {currentStatus}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateApproval(grant._id, "approved")}
                          disabled={currentStatus === "approved"}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateApproval(grant._id, "rejected")}
                          disabled={currentStatus === "rejected"}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {status === "success" && grants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No grants are stored yet. Add grants through the database or the funder submission workflow when it is connected.
          </div>
        ) : null}
      </section>
    </RoleGate>
  );
}
