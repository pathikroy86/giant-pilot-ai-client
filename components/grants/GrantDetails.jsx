"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { getBackendAuthToken } from "@/lib/auth-bridge";

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
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [agentStatus, setAgentStatus] = useState("idle");
  const [agentMessage, setAgentMessage] = useState("");
  const [eligibilityReport, setEligibilityReport] = useState(null);

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

  const saveGrant = async () => {
    setSaveStatus("loading");
    setSaveMessage("");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/grants/${slug}/save`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save this grant");
      }

      setSaveStatus("success");
      setSaveMessage("Grant saved with your application description.");
    } catch (saveError) {
      setSaveStatus("error");
      setSaveMessage(saveError.message);
    }
  };

  const runEligibilityAgent = async () => {
    setAgentStatus("loading");
    setAgentMessage("");
    setEligibilityReport(null);

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(
        `${getApiBaseUrl()}/api/grants/${slug}/eligibility`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ notes }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not run eligibility agent");
      }

      setEligibilityReport(data.report);
      setAgentStatus("success");
    } catch (agentError) {
      setAgentStatus("error");
      setAgentMessage(agentError.message);
    }
  };

  if (status === "loading") {
    return (
      <section className="bg-slate-50 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white sm:h-96" />
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="bg-slate-50 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-100 bg-red-50 p-5 sm:p-8">
            <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">Grant unavailable</h1>
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
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/explore"
          className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
        >
          Back to Explore
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-blue-950 p-5 text-white sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                  {grant.category}
                </p>
                <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
                  {grant.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">
                  {grant.summary}
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-5 lg:min-w-60">
                <p className="text-sm font-semibold text-blue-100">Profile match</p>
                <p className="mt-2 text-3xl font-bold sm:text-4xl">{grant.match}%</p>
                <p className="mt-2 text-sm text-blue-100">
                  Approved for public discovery
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-blue-950 sm:text-2xl">Overview</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {grant.summary}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-blue-950 sm:text-2xl">
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
                <h2 className="text-xl font-bold text-blue-950 sm:text-2xl">
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

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <label
                  htmlFor="application-description"
                  className="text-sm font-bold text-blue-950"
                >
                  Application description
                </label>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Add your project, organization, or evidence notes. These notes
                  are saved with the grant and used by the eligibility agent.
                </p>
                <textarea
                  id="application-description"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={5}
                  className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Example: We are a nonprofit running after-school STEM programs for low-income students in Ohio..."
                />
              </div>

              <button
                type="button"
                onClick={runEligibilityAgent}
                disabled={agentStatus === "loading"}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
              >
                {agentStatus === "loading"
                  ? "Running eligibility..."
                  : "Run eligibility agent"}
              </button>
              <button
                type="button"
                onClick={saveGrant}
                disabled={saveStatus === "loading"}
                className="w-full rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                {saveStatus === "loading" ? "Saving..." : "Save grant"}
              </button>

              {saveMessage ? (
                <p
                  className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                    saveStatus === "success"
                      ? "bg-cyan-50 text-cyan-800"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  {saveMessage}
                </p>
              ) : null}

              {agentMessage ? (
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {agentMessage}
                </p>
              ) : null}
            </aside>
          </div>
        </div>

        {eligibilityReport ? (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                  Eligibility agent
                </p>
                <h2 className="mt-2 text-xl font-bold text-blue-950 sm:text-2xl">
                  {eligibilityReport.readiness}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {eligibilityReport.summary}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 px-5 py-4 text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {eligibilityReport.eligibilityScore}
                </p>
                <p className="text-xs font-bold uppercase text-blue-500">
                  eligibility score
                </p>
              </div>
            </div>

            {eligibilityReport.providerStatus === "rules-preview" ? (
              <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Add a Gemini API key in the backend .env file for full LLM
                reasoning. This saved report uses the local readiness preview.
              </p>
            ) : null}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Strengths", eligibilityReport.strengths],
                ["Gaps", eligibilityReport.gaps],
                ["Documents", eligibilityReport.requiredDocuments],
                ["Next steps", eligibilityReport.nextSteps],
              ].map(([title, items]) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-sm font-bold uppercase text-blue-950">
                    {title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {(items || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Related grants
              </p>
              <h2 className="mt-2 text-xl font-bold text-blue-950 sm:text-2xl">
                Other approved opportunities in {grant.category}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 sm:p-8">
              No related approved grants are available yet.
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
