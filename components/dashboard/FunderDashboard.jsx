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

const initialGrantForm = {
  title: "",
  category: "Education",
  summary: "",
  minAmount: "",
  maxAmount: "",
  deadline: "",
  region: "",
  source: "",
  eligibility: "",
};

const categoryOptions = [
  "Education",
  "Health",
  "Climate",
  "Community Development",
  "Arts and Culture",
  "Technology",
  "Workforce",
  "Research",
];

function approvalTone(status) {
  if (status === "approved") return "green";
  if (status === "rejected") return "slate";
  return "amber";
}

function applicationLabel(status) {
  if (status === "approved") return "Eligible";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  if (!amount) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value || value === "Rolling") {
    return value || "Rolling";
  }

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

export default function FunderDashboard() {
  const [grants, setGrants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationNotes, setApplicationNotes] = useState({});
  const [formData, setFormData] = useState(initialGrantForm);
  const [status, setStatus] = useState("loading");
  const [formStatus, setFormStatus] = useState("idle");
  const [reviewStatus, setReviewStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const loadFunderData = useCallback(async () => {
    try {
      setStatus("loading");
      const token = await getBackendAuthToken();
      const headers = { authorization: `Bearer ${token}` };
      const [grantsResponse, applicationsResponse] = await Promise.all([
        fetch(`${getApiBaseUrl()}/api/my/grants`, { headers }),
        fetch(`${getApiBaseUrl()}/api/my/grant-applications`, { headers }),
      ]);
      const [grantsData, applicationsData] = await Promise.all([
        grantsResponse.json(),
        applicationsResponse.json(),
      ]);

      if (!grantsResponse.ok) {
        throw new Error(grantsData.message || "Could not load funder grants");
      }

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsData.message || "Could not load grant applications",
        );
      }

      setGrants(grantsData);
      setApplications(applicationsData);
      setStatus("success");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadFunderData, 0);
    return () => window.clearTimeout(timer);
  }, [loadFunderData]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitGrant = async (event) => {
    event.preventDefault();
    setFormStatus("loading");
    setMessage("");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/my/grants`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit grant");
      }

      setGrants((current) => [data.grant, ...current]);
      setFormData(initialGrantForm);
      setFormStatus("success");
      setStatus("success");
      setMessage("Grant submitted. It is now waiting for admin approval.");
    } catch (error) {
      setFormStatus("error");
      setMessage(error.message);
    }
  };

  const updateApplicationNote = (applicationId, value) => {
    setApplicationNotes((current) => ({ ...current, [applicationId]: value }));
  };

  const updateApplicationStatus = async (applicationId, applicationStatus) => {
    setReviewStatus("loading");
    setMessage("");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(
        `${getApiBaseUrl()}/api/my/grant-applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            status: applicationStatus,
            funderNote: applicationNotes[applicationId] || "",
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update application");
      }

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId ? data.application : application,
        ),
      );
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReviewStatus("idle");
    }
  };

  const approved = useMemo(
    () => grants.filter((grant) => grant.approvalStatus === "approved").length,
    [grants],
  );
  const pending = useMemo(
    () =>
      grants.filter((grant) => (grant.approvalStatus || "pending") === "pending")
        .length,
    [grants],
  );
  const rejected = useMemo(
    () => grants.filter((grant) => grant.approvalStatus === "rejected").length,
    [grants],
  );
  const approvedFunding = useMemo(
    () =>
      grants
        .filter((grant) => grant.approvalStatus === "approved")
        .reduce((sum, grant) => sum + Number(grant.maxAmount || 0), 0),
    [grants],
  );
  const pendingApplications = useMemo(
    () =>
      applications.filter(
        (application) => (application.status || "pending") === "pending",
      ).length,
    [applications],
  );
  const eligibleApplications = useMemo(
    () => applications.filter((application) => application.status === "approved").length,
    [applications],
  );
  const applicationsPagination = usePagination(applications, 6);
  const grantsPagination = usePagination(grants, 6);

  return (
    <RoleGate allowedRoles={["funder"]}>
      <DashboardHeader
        eyebrow="Funder dashboard"
        title="Submit grants and track admin approval."
        description="Create funding opportunities, monitor approval status, and keep rejected listings ready for revision."
        action={
          <a
            href="#submit-grant"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Add grant
          </a>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="My grants"
          value={status === "loading" ? "..." : grants.length}
          detail="Submitted from this funder account"
        />
        <StatCard
          label="Approved"
          value={approved}
          detail="Visible to grant seekers"
        />
        <StatCard
          label="Pending review"
          value={pending}
          detail="Waiting for admin approval"
        />
        <StatCard
          label="Approved funding"
          value={formatCurrency(approvedFunding)}
          detail={`${rejected} rejected listings need revision`}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          detail={`${pendingApplications} pending, ${eligibleApplications} eligible`}
        />
      </div>

      {message ? (
        <p
          className={`mt-6 rounded-lg px-4 py-3 text-sm font-semibold ${
            formStatus === "error" || status === "error"
              ? "bg-red-50 text-red-700"
              : "bg-cyan-50 text-cyan-800"
          }`}
        >
          {message}
        </p>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              Seeker applications
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review applications submitted to your approved grants and mark
              seekers eligible when they fit.
            </p>
          </div>
          <StatusPill tone="amber">{pendingApplications} pending</StatusPill>
        </div>

        <div className="mt-6 grid gap-4">
          {applicationsPagination.items.map((application) => {
            const currentStatus = application.status || "pending";

            return (
              <article
                key={application._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-cyan-600">
                      {application.grant?.title || application.grantTitle}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-blue-950">
                      {application.projectTitle}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {application.applicantName} | {application.applicantEmail}
                    </p>
                  </div>
                  <StatusPill tone={approvalTone(currentStatus)}>
                    {applicationLabel(currentStatus)}
                  </StatusPill>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-4 text-sm leading-6 text-slate-600">
                    <p>{application.proposalSummary}</p>
                    {application.evidenceNotes ? (
                      <p className="rounded-lg bg-white px-4 py-3">
                        Evidence: {application.evidenceNotes}
                      </p>
                    ) : null}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Requested
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {formatCurrency(application.requestedAmount)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Contact
                        </p>
                        <p className="mt-1 break-words font-bold text-slate-800">
                          {application.contactEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`funder-note-${application._id}`}
                      className="text-sm font-bold text-blue-950"
                    >
                      Funder note
                    </label>
                    <textarea
                      id={`funder-note-${application._id}`}
                      value={
                        applicationNotes[application._id] ??
                        application.funderNote ??
                        ""
                      }
                      onChange={(event) =>
                        updateApplicationNote(application._id, event.target.value)
                      }
                      rows={4}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Add eligibility decision notes"
                    />
                    <div className="mt-3 grid gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(application._id, "approved")
                        }
                        disabled={
                          currentStatus === "approved" ||
                          reviewStatus === "loading"
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Approve as eligible
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateApplicationStatus(application._id, "rejected")
                        }
                        disabled={
                          currentStatus === "rejected" ||
                          reviewStatus === "loading"
                        }
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject application
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
            Applications from grant seekers will appear here after they apply to
            one of your grants.
          </div>
        ) : null}
      </section>

      <section
        id="submit-grant"
        className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <form
          onSubmit={handleSubmitGrant}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                Submit a grant
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                New grants are saved as pending and stay hidden until admin
                approval.
              </p>
            </div>
            <StatusPill tone="amber">Admin review</StatusPill>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-semibold text-slate-700"
              >
                Grant title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Community Learning Innovation Fund"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-semibold text-slate-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {categoryOptions.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="text-sm font-semibold text-slate-700"
                >
                  Deadline
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="minAmount"
                  className="text-sm font-semibold text-slate-700"
                >
                  Minimum award
                </label>
                <input
                  id="minAmount"
                  name="minAmount"
                  type="number"
                  min="0"
                  value={formData.minAmount}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="25000"
                />
              </div>

              <div>
                <label
                  htmlFor="maxAmount"
                  className="text-sm font-semibold text-slate-700"
                >
                  Maximum award
                </label>
                <input
                  id="maxAmount"
                  name="maxAmount"
                  type="number"
                  min="0"
                  value={formData.maxAmount}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="150000"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="region"
                  className="text-sm font-semibold text-slate-700"
                >
                  Region
                </label>
                <input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="United States"
                />
              </div>

              <div>
                <label
                  htmlFor="source"
                  className="text-sm font-semibold text-slate-700"
                >
                  Source link
                </label>
                <input
                  id="source"
                  name="source"
                  type="url"
                  value={formData.source}
                  onChange={updateField}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="https://example.org/grants"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="summary"
                className="text-sm font-semibold text-slate-700"
              >
                Public summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={updateField}
                required
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Describe who should apply, what this grant funds, and the impact area."
              />
            </div>

            <div>
              <label
                htmlFor="eligibility"
                className="text-sm font-semibold text-slate-700"
              >
                Eligibility requirements
              </label>
              <textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={updateField}
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="One requirement per line"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formStatus === "loading"}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {formStatus === "loading"
              ? "Submitting..."
              : "Submit for admin approval"}
          </button>
        </form>

        <aside className="rounded-xl border border-slate-200 bg-blue-950 p-4 text-white shadow-sm sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            What admins review
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Complete listings move through approval faster.
          </h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Clear fit", "Who should apply and what outcomes are funded."],
              ["Funding range", "Minimum and maximum award amounts."],
              ["Eligibility", "Applicant type, location, and required proof."],
              ["Source", "A link or reference admins can verify."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-lg border border-white/15 bg-white/10 p-4"
              >
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-sm leading-6 text-blue-100">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              My grant approval pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Approved grants appear in Explore, grant details, insights, and
              grant seeker dashboards.
            </p>
          </div>
          <StatusPill tone="cyan">
            {status === "loading" ? "Loading" : `${grants.length} submitted`}
          </StatusPill>
        </div>

        <div className="mt-6 grid gap-4">
          {grantsPagination.items.map((grant) => {
            const currentStatus = grant.approvalStatus || "pending";

            return (
              <article
                key={grant._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
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
                  <StatusPill tone={approvalTone(currentStatus)}>
                    {currentStatus}
                  </StatusPill>
                </div>

                <div className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Funding
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {grant.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Deadline
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDate(grant.deadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Region
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {grant.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Public link
                    </p>
                    {currentStatus === "approved" ? (
                      <Link
                        href={`/grants/${grant.slug}`}
                        className="mt-1 inline-flex break-all font-semibold text-blue-700 transition hover:text-blue-900"
                      >
                        View public grant
                      </Link>
                    ) : (
                      <p className="mt-1 font-semibold text-slate-800">
                        Hidden until approved
                      </p>
                    )}
                  </div>
                </div>

                {currentStatus === "rejected" ? (
                  <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                    This listing was rejected. Review the grant details and
                    submit a cleaner version for approval.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        {grants.length > 0 ? (
          <Pagination
            page={grantsPagination.page}
            totalPages={grantsPagination.totalPages}
            totalItems={grantsPagination.totalItems}
            pageSize={grantsPagination.pageSize}
            label="grants"
            onPageChange={grantsPagination.setPage}
          />
        ) : null}

        {status === "success" && grants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <h3 className="text-xl font-bold text-blue-950">
              No funder grants yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Submit your first grant above. It will appear here immediately as
              pending admin approval.
            </p>
          </div>
        ) : null}
      </section>
    </RoleGate>
  );
}
