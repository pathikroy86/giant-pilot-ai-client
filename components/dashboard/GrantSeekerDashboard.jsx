"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { DashboardHeader, StatCard, StatusPill } from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";
import { getBackendAuthToken } from "@/lib/auth-bridge";

export default function GrantSeekerDashboard() {
  const [grants, setGrants] = useState([]);
  const [savedGrants, setSavedGrants] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadGrants = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();
        setGrants(response.ok ? data : []);
        try {
          const token = await getBackendAuthToken();
          const savedResponse = await fetch(`${getApiBaseUrl()}/api/my/saved-grants`, {
            headers: { authorization: `Bearer ${token}` },
          });
          const savedData = await savedResponse.json();

          setSavedGrants(savedResponse.ok ? savedData : []);
        } catch {
          setSavedGrants([]);
        }
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Approved grants" value={status === "loading" ? "..." : grants.length} detail="Visible after admin approval" />
        <StatCard label="Strong matches" value={highMatchCount} detail="Approved grants at 85% or higher" />
        <StatCard label="Saved grants" value={savedGrants.length} detail="Saved from grant details" />
        <StatCard label="Categories" value={categoryCount} detail="Funding areas available" />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <div key={grant._id || grant.slug} className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
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

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">Saved grants</h2>
            <p className="mt-2 text-sm text-slate-500">
              Grants you saved from the details page with your application
              description.
            </p>
          </div>
          <StatusPill tone="green">{savedGrants.length} saved</StatusPill>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {savedGrants.map((savedItem) => (
            <Link
              key={savedItem._id}
              href={`/grants/${savedItem.grant.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white"
            >
              <p className="text-xs font-bold uppercase text-cyan-600">
                {savedItem.grant.category}
              </p>
              <h3 className="mt-2 text-lg font-bold text-blue-950">
                {savedItem.grant.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {savedItem.notes || savedItem.grant.summary}
              </p>
            </Link>
          ))}
        </div>

        {status === "success" && savedGrants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Saved grants will appear here after you save them from a grant
            details page.
          </div>
        ) : null}
      </section>
    </RoleGate>
  );
}
