"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

function formatDeadline(deadline) {
  if (!deadline) return "Not specified";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${deadline}T00:00:00`));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function GrantDetails() {
  const { slug } = useParams();
  const [grant, setGrant] = useState(null);
  const [approvedGrants, setApprovedGrants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGrant = async () => {
      try {
        setStatus("loading");
        const [grantResponse, grantsResponse] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/grants/${slug}`),
          fetch(`${getApiBaseUrl()}/api/grants`),
        ]);
        const [grantData, grantsData] = await Promise.all([
          grantResponse.json(),
          grantsResponse.json(),
        ]);

        if (!grantResponse.ok) {
          throw new Error(grantData.message || "Grant details are unavailable");
        }

        setGrant(grantData);
        setApprovedGrants(grantsResponse.ok ? grantsData : []);
        setStatus("success");
      } catch (loadError) {
        setError(loadError.message);
        setStatus("error");
      }
    };

    if (slug) {
      loadGrant();
    }
  }, [slug]);

  const relatedGrants = useMemo(() => {
    if (!grant) return [];

    return approvedGrants
      .filter((item) => item.slug !== grant.slug && item.category === grant.category)
      .slice(0, 3);
  }, [approvedGrants, grant]);

  if (status === "loading") {
    return (
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-100 bg-red-50 p-8">
            <h1 className="text-3xl font-bold text-blue-950">Grant unavailable</h1>
            <p className="mt-3 text-sm leading-6 text-red-700">{error}</p>
            <Link
              href="/explore"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/explore"
          className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
        >
          Back to Explore
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-blue-950 p-8 text-white sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                  {grant.category}
                </p>
                <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
                  {grant.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">
                  {grant.summary}
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-5 lg:min-w-60">
                <p className="text-sm font-semibold text-blue-100">Profile match</p>
                <p className="mt-2 text-4xl font-bold">{grant.match}%</p>
                <p className="mt-2 text-sm text-blue-100">
                  Approved for public discovery
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-blue-950">Overview</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {grant.summary}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-950">
                  Eligibility requirements
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(grant.eligibility || []).map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-blue-950">
                  Evidence and review signals
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {[
                    ["Source", grant.source || "Not specified"],
                    ["Approval", grant.approvalStatus],
                    ["Region", grant.region || "Not specified"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-xs font-bold uppercase text-cyan-600">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-blue-950">
                  Key information
                </h2>
                <div className="mt-5 space-y-4 text-sm">
                  {[
                    ["Funder", grant.funder],
                    ["Funding range", grant.amount],
                    ["Minimum award", formatCurrency(grant.minAmount)],
                    ["Maximum award", formatCurrency(grant.maxAmount)],
                    ["Deadline", formatDeadline(grant.deadline)],
                    ["Status", grant.status],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-500">{label}</span>
                      <span className="text-right font-bold text-slate-800">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Run eligibility agent
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Save grant
              </button>
            </aside>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Related grants
              </p>
              <h2 className="mt-2 text-2xl font-bold text-blue-950">
                Other approved opportunities in {grant.category}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {relatedGrants.map((relatedGrant) => (
              <Link
                key={relatedGrant._id || relatedGrant.slug}
                href={`/grants/${relatedGrant.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase text-cyan-600">
                  {relatedGrant.category}
                </p>
                <h3 className="mt-3 font-bold text-blue-950">
                  {relatedGrant.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {relatedGrant.amount}
                </p>
              </Link>
            ))}
          </div>

          {relatedGrants.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No related approved grants are available yet.
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
