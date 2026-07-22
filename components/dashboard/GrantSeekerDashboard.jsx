"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import {
  DashboardHeader,
  StatCard,
  StatusPill,
} from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";
import { getBackendAuthToken } from "@/lib/auth-bridge";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/lib/use-pagination";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getReadinessTone(score) {
  if (score >= 75) return "green";
  if (score >= 40) return "cyan";
  return "amber";
}

function getReadinessLabel(score) {
  if (score >= 75) return "Strong";
  if (score >= 40) return "Building";
  return "Getting started";
}

function applicationTone(status) {
  if (status === "approved") return "green";
  if (status === "rejected") return "slate";
  return "amber";
}

function applicationLabel(status) {
  if (status === "approved") return "Eligible";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export default function GrantSeekerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setStatus("loading");
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/my/dashboard`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load your dashboard");
      }

      setDashboard(data);
      setStatus("success");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const stats = dashboard?.stats || {
    approvedGrants: 0,
    highMatchCount: 0,
    savedGrants: 0,
    eligibilityReports: 0,
    applications: 0,
    approvedApplications: 0,
    readinessScore: 0,
  };
  const recommendedGrants = useMemo(
    () => dashboard?.recommendedGrants || [],
    [dashboard?.recommendedGrants],
  );
  const savedGrants = useMemo(
    () => dashboard?.savedGrants || [],
    [dashboard?.savedGrants],
  );
  const eligibilityReports = useMemo(
    () => dashboard?.eligibilityReports || [],
    [dashboard?.eligibilityReports],
  );
  const applications = useMemo(
    () => dashboard?.applications || [],
    [dashboard?.applications],
  );
  const recentInteractions = useMemo(
    () => dashboard?.recentInteractions || [],
    [dashboard?.recentInteractions],
  );
  const user = dashboard?.user;
  const readinessTasks = useMemo(
    () => [
      {
        label: "Save one grant",
        complete: stats.savedGrants > 0,
        detail: "Use the grant details page to save a target opportunity.",
      },
      {
        label: "Run eligibility",
        complete: stats.eligibilityReports > 0,
        detail: "Generate a readiness report from an approved grant.",
      },
      {
        label: "Submit application",
        complete: stats.applications > 0,
        detail: "Apply to a grant so the funder can review your eligibility.",
      },
      {
        label: "Use AI recommendations",
        complete: recentInteractions.some(
          (interaction) => interaction.eventType === "ai_recommendation",
        ),
        detail: "Rank grants using your interests, region, and funding range.",
      },
      {
        label: "Analyze a document",
        complete: recentInteractions.some(
          (interaction) => interaction.eventType === "document_intelligence",
        ),
        detail: "Upload PDF, DOCX, or TXT guidance for key points.",
      },
    ],
    [stats.savedGrants, stats.eligibilityReports, stats.applications, recentInteractions],
  );
  const recommendedPagination = usePagination(recommendedGrants, 6);
  const applicationsPagination = usePagination(applications, 6);
  const savedPagination = usePagination(savedGrants, 6);
  const reportsPagination = usePagination(eligibilityReports, 6);

  return (
    <RoleGate allowedRoles={["applicant", "user"]}>
      <DashboardHeader
        eyebrow="Grant seeker dashboard"
        title="Your grant readiness workspace."
        description="Review approved opportunities, track saved grants, and continue AI-assisted eligibility work from your own MongoDB activity."
        action={
          <Link
            href="/explore"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Explore grants
          </Link>
        }
      />

      {message ? (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {message}
        </p>
      ) : null}

      <section className="mb-8 rounded-xl border border-slate-200 bg-blue-950 p-4 text-white shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Signed in as grant seeker
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {user?.name ? `Welcome back, ${user.name}.` : "Welcome back."}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
              {user?.organizationProfile?.name
                ? `${user.organizationProfile.name} can use this workspace to prioritize approved grants, save notes, and prepare eligibility evidence.`
                : "Use this workspace to prioritize approved grants, save notes, and prepare eligibility evidence."}
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-100">
                  Readiness
                </p>
                <p className="mt-2 text-4xl font-bold">
                  {stats.readinessScore}
                </p>
              </div>
              <StatusPill tone={getReadinessTone(stats.readinessScore)}>
                {getReadinessLabel(stats.readinessScore)}
              </StatusPill>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Approved grants"
          value={status === "loading" ? "..." : stats.approvedGrants}
          detail="Visible after admin approval"
        />
        <StatCard
          label="Strong matches"
          value={stats.highMatchCount}
          detail="Approved grants at 85% or higher"
        />
        <StatCard
          label="Applications"
          value={stats.applications}
          detail="Submitted to funders"
        />
        <StatCard
          label="Eligible"
          value={stats.approvedApplications}
          detail="Approved by funders"
        />
        <StatCard
          label="Eligibility reports"
          value={stats.eligibilityReports}
          detail="Generated by the eligibility agent"
        />
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Readiness checklist
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Complete these steps to prepare stronger applications.
              </p>
            </div>
            <StatusPill tone={getReadinessTone(stats.readinessScore)}>
              {stats.readinessScore}/100
            </StatusPill>
          </div>

          <div className="mt-6 grid gap-3">
            {readinessTasks.map((task) => (
              <div
                key={task.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-blue-950">{task.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {task.detail}
                    </p>
                  </div>
                  <StatusPill tone={task.complete ? "green" : "amber"}>
                    {task.complete ? "Done" : "Next"}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Quick actions
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Continue the work most grant seekers need next.
              </p>
            </div>
            <StatusPill tone="cyan">AI tools</StatusPill>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [
                "Get AI recommendations",
                "Rank grants against your interests and project context.",
                "/ai/recommendations",
              ],
              [
                "Analyze documents",
                "Summarize guidelines, tables, actions, and risks.",
                "/ai/documents",
              ],
              [
                "Ask assistant",
                "Use chat memory to reason through next steps.",
                "/ai/workspace",
              ],
              [
                "Browse approved grants",
                "Search live MongoDB grants approved by admin.",
                "/explore",
              ],
            ].map(([title, description, href]) => (
              <Link
                key={title}
                href={href}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white"
              >
                <p className="font-bold text-blue-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              Recommended approved grants
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ranked from live approved grants in MongoDB.
            </p>
          </div>
          <StatusPill tone="cyan">
            {status === "loading" ? "Loading" : `${recommendedGrants.length} matched`}
          </StatusPill>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {recommendedPagination.items.map((grant) => (
            <Link
              key={grant._id || grant.slug}
              href={`/grants/${grant.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600">
                    {grant.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-blue-950">
                    {grant.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {grant.summary}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-blue-700">
                    {grant.match}%
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    profile match
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recommendedGrants.length > 0 ? (
          <Pagination
            page={recommendedPagination.page}
            totalPages={recommendedPagination.totalPages}
            totalItems={recommendedPagination.totalItems}
            pageSize={recommendedPagination.pageSize}
            label="grants"
            onPageChange={recommendedPagination.setPage}
          />
        ) : null}

        {status === "success" && recommendedGrants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <h3 className="text-xl font-bold text-blue-950">
              No approved grants yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Grants will appear here after an admin approves them.
            </p>
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              My grant applications
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Applications you submitted from grant details pages. Funder
              decisions appear here.
            </p>
          </div>
          <StatusPill tone="blue">{applications.length} submitted</StatusPill>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {applicationsPagination.items.map((application) => (
            <Link
              key={application._id}
              href={`/grants/${application.grant.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600">
                    {application.grant.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-blue-950">
                    {application.projectTitle}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {application.grant.title}
                  </p>
                </div>
                <StatusPill tone={applicationTone(application.status)}>
                  {applicationLabel(application.status)}
                </StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {application.proposalSummary}
              </p>
              {application.funderNote ? (
                <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                  Funder note: {application.funderNote}
                </p>
              ) : null}
            </Link>
          ))}
        </div>

        {applications.length > 0 ? (
          <Pagination
            page={applicationsPagination.page}
            totalPages={applicationsPagination.totalPages}
            totalItems={applicationsPagination.totalItems}
            pageSize={applicationsPagination.pageSize}
            label="applications"
            onPageChange={applicationsPagination.setPage}
          />
        ) : null}

        {status === "success" && applications.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Apply from any approved grant details page. Submitted applications
            will appear here for status tracking.
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Saved grants
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Grants saved from details pages with your notes.
              </p>
            </div>
            <StatusPill tone="green">{savedGrants.length} saved</StatusPill>
          </div>

          <div className="mt-6 grid gap-4">
            {savedPagination.items.map((savedItem) => (
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

          {savedGrants.length > 0 ? (
            <Pagination
              page={savedPagination.page}
              totalPages={savedPagination.totalPages}
              totalItems={savedPagination.totalItems}
              pageSize={savedPagination.pageSize}
              label="saved grants"
              onPageChange={savedPagination.setPage}
            />
          ) : null}

          {status === "success" && savedGrants.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Saved grants will appear here after you save them from a grant
              details page.
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Eligibility reports
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Reports generated by the eligibility agent.
              </p>
            </div>
            <StatusPill tone="blue">
              {eligibilityReports.length} reports
            </StatusPill>
          </div>

          <div className="mt-6 grid gap-4">
            {reportsPagination.items.map((report) => (
              <Link
                key={report._id}
                href={`/grants/${report.grant.slug}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-cyan-600">
                      {formatDate(report.createdAt)}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-blue-950">
                      {report.grant.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {report.report?.summary}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                    <p className="text-xl font-bold text-blue-700">
                      {report.report?.eligibilityScore || 0}
                    </p>
                    <p className="text-xs font-bold uppercase text-blue-500">
                      score
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {eligibilityReports.length > 0 ? (
            <Pagination
              page={reportsPagination.page}
              totalPages={reportsPagination.totalPages}
              totalItems={reportsPagination.totalItems}
              pageSize={reportsPagination.pageSize}
              label="reports"
              onPageChange={reportsPagination.setPage}
            />
          ) : null}

          {status === "success" && eligibilityReports.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Run the eligibility agent on a saved grant to see readiness
              reports here.
            </div>
          ) : null}
        </div>
      </section>
    </RoleGate>
  );
}
