"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { DashboardHeader, StatCard, StatusPill } from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";

function isDeadlineSoon(deadline) {
  const diffMs = new Date(`${deadline}T00:00:00`).getTime() - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 45;
}

export default function GrantSeekerDashboard() {
  const [grants, setGrants] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadGrants = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();
        setGrants(response.ok ? data : []);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    loadGrants();
  }, []);

  const recommendedGrants = useMemo(() => grants.slice(0, 4), [grants]);
  const highMatchCount = useMemo(
    () => grants.filter((grant) => Number(grant.match) >= 85).length,
    [grants]
  );
  const deadlineSoonCount = useMemo(
    () => grants.filter((grant) => isDeadlineSoon(grant.deadline)).length,
    [grants]
  );
  const categoryCount = useMemo(
    () => new Set(grants.map((grant) => grant.category).filter(Boolean)).size,
    [grants]
  );

  return (
    <RoleGate allowedRoles={["applicant", "user"]}>
      <DashboardHeader
        eyebrow="Grant seeker dashboard"
        title="Your approved grant workspace."
        description="Only admin-approved grants are shown here. Pending or rejected grants stay hidden until review is complete."
        action={
          <Link
            href="/explore"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Explore grants
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Approved grants" value={status === "loading" ? "..." : grants.length} detail="Visible after admin approval" />
        <StatCard label="Strong matches" value={highMatchCount} detail="Approved grants at 85% or higher" />
        <StatCard label="Deadline soon" value={deadlineSoonCount} detail="Approved grants due within 45 days" />
        <StatCard label="Categories" value={categoryCount} detail="Funding areas available" />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">Recommended approved grants</h2>
            <p className="mt-2 text-sm text-slate-500">
              Loaded from MongoDB through the public approved-grants API.
            </p>
          </div>
          <StatusPill tone="cyan">{status === "loading" ? "Loading" : `${grants.length} available`}</StatusPill>
        </div>

        <div className="mt-6 space-y-4">
          {recommendedGrants.map((grant) => (
            <div key={grant._id || grant.slug} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600">{grant.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-blue-950">{grant.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{grant.summary}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-blue-700">{grant.match}%</p>
                  <p className="text-xs font-semibold text-slate-500">profile match</p>
                </div>
              </div>
            </div>
          ))}

          {status === "success" && recommendedGrants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <h3 className="text-xl font-bold text-blue-950">No approved grants yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Grants will appear here after an admin approves them.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </RoleGate>
  );
}
