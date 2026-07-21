"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { DashboardHeader, StatCard, StatusPill } from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";

function approvalTone(status) {
  if (status === "approved") return "green";
  if (status === "rejected") return "slate";
  return "amber";
}

export default function FunderDashboard() {
  const [grants, setGrants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadMyGrants = useCallback(async () => {
    const token = localStorage.getItem("grantpilot_auth_token");

    if (!token) {
      setStatus("error");
      setMessage("Sign in as a funder to load your grants.");
      return;
    }

    try {
      setStatus("loading");
      const response = await fetch(`${getApiBaseUrl()}/api/my/grants`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load funder grants");
      }

      setGrants(data);
      setStatus("success");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadMyGrants, 0);
    return () => window.clearTimeout(timer);
  }, [loadMyGrants]);

  const approved = useMemo(
    () => grants.filter((grant) => grant.approvalStatus === "approved").length,
    [grants]
  );
  const pending = useMemo(
    () => grants.filter((grant) => (grant.approvalStatus || "pending") === "pending").length,
    [grants]
  );
  const rejected = useMemo(
    () => grants.filter((grant) => grant.approvalStatus === "rejected").length,
    [grants]
  );

  return (
    <RoleGate allowedRoles={["funder"]}>
      <DashboardHeader
        eyebrow="Funder dashboard"
        title="Track grants waiting for approval."
        description="Funder grants stay hidden from public pages until an admin reviews and approves them."
        action={
          <Link
            href="/dashboard/funder"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Add grant
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="My grants" value={status === "loading" ? "..." : grants.length} detail="Loaded from MongoDB" />
        <StatCard label="Approved" value={approved} detail="Visible to grant seekers" />
        <StatCard label="Pending review" value={pending} detail="Waiting for admin approval" />
        <StatCard label="Rejected" value={rejected} detail="Requires revision before public listing" />
      </div>

      {message ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {message}
        </p>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-950">My grant approval pipeline</h2>
        <p className="mt-2 text-sm text-slate-500">
          Only grants created by your funder account appear here.
        </p>

        <div className="mt-6 space-y-4">
          {grants.map((grant) => {
            const currentStatus = grant.approvalStatus || "pending";

            return (
              <div key={grant._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-cyan-600">{grant.category}</p>
                    <h3 className="mt-2 font-bold text-blue-950">{grant.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{grant.summary}</p>
                  </div>
                  <StatusPill tone={approvalTone(currentStatus)}>{currentStatus}</StatusPill>
                </div>
                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:grid-cols-3">
                  <span>{grant.amount}</span>
                  <span>{grant.deadline}</span>
                  <span>{grant.region}</span>
                </div>
              </div>
            );
          })}
        </div>

        {status === "success" && grants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <h3 className="text-xl font-bold text-blue-950">No funder grants yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              The next backend step is a funder grant submission form that saves
              new records as pending admin approval.
            </p>
          </div>
        ) : null}
      </section>
    </RoleGate>
  );
}
