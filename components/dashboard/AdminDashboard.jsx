"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { DashboardHeader, StatCard, StatusPill } from "@/components/dashboard/DashboardCards";
import RoleGate from "@/components/dashboard/RoleGate";
import { getBackendAuthToken } from "@/lib/auth-bridge";

function approvalTone(status) {
  if (status === "approved") return "green";
  if (status === "rejected") return "slate";
  return "amber";
}

export default function AdminDashboard() {
  const [grants, setGrants] = useState([]);
  const [funders, setFunders] = useState([]);
  const [selectedGrantId, setSelectedGrantId] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [actionStatus, setActionStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const loadAdminData = useCallback(async () => {
    try {
      setStatus("loading");
      const token = await getBackendAuthToken();
      const headers = { authorization: `Bearer ${token}` };
      const [grantsResponse, statsResponse, fundersResponse] = await Promise.all([
        fetch(`${getApiBaseUrl()}/api/admin/grants`, { headers }),
        fetch(`${getApiBaseUrl()}/api/admin/stats`, { headers }),
        fetch(`${getApiBaseUrl()}/api/admin/funders`, { headers }),
      ]);
      const [grantsData, statsData, fundersData] = await Promise.all([
        grantsResponse.json(),
        statsResponse.json(),
        fundersResponse.json(),
      ]);

      if (!grantsResponse.ok) {
        throw new Error(grantsData.message || "Could not load grants");
      }

      if (!statsResponse.ok) {
        throw new Error(statsData.message || "Could not load stats");
      }

      if (!fundersResponse.ok) {
        throw new Error(fundersData.message || "Could not load funders");
      }

      setGrants(grantsData);
      setFunders(fundersData);
      setSelectedGrantId((currentId) =>
        currentId && grantsData.some((grant) => grant._id === currentId)
          ? currentId
          : ""
      );
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
    setMessage("");
    setActionStatus("loading");

    try {
      const token = await getBackendAuthToken();
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
    } finally {
      setActionStatus("idle");
    }
  };

  const deleteRejectedGrant = async (grantId) => {
    setMessage("");
    setActionStatus("loading");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/admin/grants/${grantId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete grant");
      }

      setGrants((current) => current.filter((grant) => grant._id !== grantId));
      setSelectedGrantId((currentId) => {
        if (currentId !== grantId) return currentId;

        const nextGrant = grants.find((grant) => grant._id !== grantId);
        return nextGrant?._id || "";
      });
      await loadAdminData();
      setMessage("Rejected grant deleted.");
      setIsDetailsOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionStatus("idle");
    }
  };

  const updateFunderApproval = async (funderId, approvalStatus) => {
    setMessage("");
    setActionStatus("loading");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(
        `${getApiBaseUrl()}/api/admin/funders/${funderId}/approval`,
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
        throw new Error(data.message || "Could not update funder approval");
      }

      setFunders((current) =>
        current.map((funder) =>
          funder._id === funderId ? data.funder : funder
        )
      );
      await loadAdminData();
      setMessage(`Funder marked as ${approvalStatus}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionStatus("idle");
    }
  };

  const pendingGrants = useMemo(() => {
    return grants.filter((grant) => (grant.approvalStatus || "pending") === "pending");
  }, [grants]);

  const pendingFunders = useMemo(() => {
    return funders.filter(
      (funder) => (funder.funderApprovalStatus || "pending") === "pending"
    );
  }, [funders]);

  const selectedGrant = useMemo(() => {
    return grants.find((grant) => grant._id === selectedGrantId) || null;
  }, [grants, selectedGrantId]);
  const selectedStatus = selectedGrant?.approvalStatus || "pending";

  const openGrantDetails = (grantId) => {
    setSelectedGrantId(grantId);
    setIsDetailsOpen(true);
  };

  return (
    <RoleGate allowedRoles={["admin"]}>
      <DashboardHeader
        eyebrow="Admin dashboard"
        title="Review grants before they go public."
        description="Every grant must be approved by admin before it appears on the landing page, Explore page, or grant seeker dashboard."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stored grants" value={status === "loading" ? "..." : stats?.grants?.total || 0} detail="All MongoDB grant records" />
        <StatCard label="Approved" value={stats?.grants?.approved || 0} detail="Visible in public UI" />
        <StatCard label="Pending review" value={stats?.grants?.pending || 0} detail="Hidden until approved" />
        <StatCard label="Pending funders" value={stats?.funders?.pending || 0} detail="Registration approvals" />
      </div>

      {message ? (
        <p className="mt-6 rounded-lg bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
          {message}
        </p>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">
              Funder registration approvals
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Funder accounts must be approved before they can manage grant
              submissions.
            </p>
          </div>
          <StatusPill tone="amber">{pendingFunders.length} pending</StatusPill>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {funders.map((funder) => {
            const currentStatus = funder.funderApprovalStatus || "pending";

            return (
              <div
                key={funder._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-cyan-600">
                      {funder.organizationProfile?.type || "Funder"}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-blue-950">
                      {funder.organizationProfile?.name || funder.name}
                    </h3>
                    <p className="mt-1 break-words text-sm text-slate-600">
                      {funder.name} | {funder.email}
                    </p>
                  </div>
                  <StatusPill tone={approvalTone(currentStatus)}>
                    {currentStatus}
                  </StatusPill>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => updateFunderApproval(funder._id, "approved")}
                    disabled={
                      currentStatus === "approved" ||
                      actionStatus === "loading"
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Approve funder
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFunderApproval(funder._id, "rejected")}
                    disabled={
                      currentStatus === "rejected" ||
                      actionStatus === "loading"
                    }
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {status === "success" && funders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No funder registrations are waiting in the database yet.
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-950">Grant approval queue</h2>
            <p className="mt-2 text-sm text-slate-500">
              Click any grant to review its details before approval.
            </p>
          </div>
          <StatusPill tone="amber">{pendingGrants.length} pending</StatusPill>
        </div>

        <div className="mt-6 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Grant</th>
                <th className="px-4 py-3">Funder</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {grants.map((grant) => {
                const currentStatus = grant.approvalStatus || "pending";
                const isSelected = selectedGrant?._id === grant._id;

                return (
                  <tr
                    key={grant._id}
                    className={isSelected ? "bg-blue-50/60" : "transition hover:bg-slate-50"}
                  >
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openGrantDetails(grant._id)}
                        className="text-left font-bold text-blue-950 transition hover:text-blue-700"
                      >
                        {grant.title}
                      </button>
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
                      <button
                        type="button"
                        onClick={() => openGrantDetails(grant._id)}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4 md:hidden">
          {grants.map((grant) => {
            const currentStatus = grant.approvalStatus || "pending";

            return (
              <button
                key={grant._id}
                type="button"
                onClick={() => openGrantDetails(grant._id)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-cyan-600">
                      {grant.category}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-6 text-blue-950">
                      {grant.title}
                    </h3>
                  </div>
                  <StatusPill tone={approvalTone(currentStatus)}>
                    {currentStatus}
                  </StatusPill>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {grant.summary}
                </p>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <span>Funder</span>
                    <span className="text-right font-bold text-slate-800">
                      {grant.funder}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Amount</span>
                    <span className="text-right font-bold text-slate-800">
                      {grant.amount}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {status === "success" && grants.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No grants are stored yet. Add grants through the database or the funder submission workflow when it is connected.
          </div>
        ) : null}
      </section>

      {isDetailsOpen && selectedGrant ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-grant-details-title"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[90vh] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                  Grant details
                </p>
                <h2
                  id="admin-grant-details-title"
                  className="mt-2 text-xl font-bold leading-tight text-blue-950 sm:text-2xl"
                >
                  {selectedGrant.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-lg font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close grant details"
              >
                x
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <StatusPill tone={approvalTone(selectedStatus)}>
                {selectedStatus}
              </StatusPill>
              <span className="text-sm font-semibold text-slate-500">
                {selectedGrant.funder}
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {selectedGrant.summary}
            </p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Funder", selectedGrant.funder],
                ["Category", selectedGrant.category],
                ["Amount", selectedGrant.amount],
                ["Minimum award", selectedGrant.minAmount || "Not specified"],
                ["Maximum award", selectedGrant.maxAmount || "Not specified"],
                ["Region", selectedGrant.region || "Not specified"],
                ["Deadline", selectedGrant.deadline || "Not specified"],
                ["Source", selectedGrant.source || "Not specified"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4"
                >
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 break-words font-bold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase text-blue-950">
                Eligibility
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(selectedGrant.eligibility || []).map((item) => (
                  <p
                    key={item}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                  >
                    {item}
                  </p>
                ))}
                {(selectedGrant.eligibility || []).length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
                    No eligibility details were added.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              {selectedStatus === "rejected" ? (
                <button
                  type="button"
                  onClick={() => deleteRejectedGrant(selectedGrant._id)}
                  disabled={actionStatus === "loading"}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete rejected grant
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => updateApproval(selectedGrant._id, "rejected")}
                disabled={selectedStatus === "rejected" || actionStatus === "loading"}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject grant
              </button>
              <button
                type="button"
                onClick={() => updateApproval(selectedGrant._id, "approved")}
                disabled={selectedStatus === "approved" || actionStatus === "loading"}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Approve grant
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </RoleGate>
  );
}
