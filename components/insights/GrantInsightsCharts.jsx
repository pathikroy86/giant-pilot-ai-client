"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

const colors = ["#2563eb", "#0891b2", "#10b981", "#f59e0b", "#64748b", "#7c3aed"];

function getDeadlineBucket(deadline) {
  if (!deadline) return "No deadline";

  const days = Math.ceil(
    (new Date(`${deadline}T00:00:00`).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24),
  );

  if (days < 0) return "Past";
  if (days <= 30) return "0-30 days";
  if (days <= 60) return "31-60 days";
  return "60+ days";
}

function summarizeByCategory(grants) {
  const grouped = new Map();

  grants.forEach((grant) => {
    const category = grant.category || "Other";
    const current = grouped.get(category) || {
      category,
      grants: 0,
      totalFunding: 0,
      averageMatch: 0,
    };

    current.grants += 1;
    current.totalFunding += Number(grant.maxAmount || 0);
    current.averageMatch += Number(grant.match || 0);
    grouped.set(category, current);
  });

  return Array.from(grouped.values())
    .map((item) => ({
      ...item,
      averageMatch: item.grants ? Math.round(item.averageMatch / item.grants) : 0,
      fundingLabel: `$${Math.round(item.totalFunding / 1000)}k`,
    }))
    .sort((a, b) => b.grants - a.grants)
    .slice(0, 6);
}

function summarizeDeadlines(grants) {
  const buckets = ["0-30 days", "31-60 days", "60+ days", "Past", "No deadline"];

  return buckets
    .map((bucket) => ({
      name: bucket,
      value: grants.filter((grant) => getDeadlineBucket(grant.deadline) === bucket).length,
    }))
    .filter((item) => item.value > 0);
}

export default function GrantInsightsCharts() {
  const [grants, setGrants] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();

        setGrants(response.ok ? data : []);
        setStatus(response.ok ? "success" : "error");
      } catch {
        setStatus("error");
      }
    };

    loadInsights();
  }, []);

  const categoryData = useMemo(() => summarizeByCategory(grants), [grants]);
  const deadlineData = useMemo(() => summarizeDeadlines(grants), [grants]);
  const totalFunding = useMemo(
    () => grants.reduce((sum, grant) => sum + Number(grant.maxAmount || 0), 0),
    [grants],
  );
  const averageMatch = useMemo(() => {
    if (!grants.length) return 0;

    return Math.round(
      grants.reduce((sum, grant) => sum + Number(grant.match || 0), 0) /
        grants.length,
    );
  }, [grants]);

  if (status === "loading") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (status === "error" || grants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Charts will appear after approved grants are available from the database.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">
            Approved grants
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-950">{grants.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">
            Max funding pool
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-950">
            ${Math.round(totalFunding / 1000)}k
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">
            Average match
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-950">
            {averageMatch}%
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Category volume
              </p>
              <h3 className="mt-2 text-xl font-bold text-blue-950">
                Approved grants by category
              </h3>
            </div>
          </div>
          <div className="h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 8, right: 10, left: -20, bottom: 54 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="category"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value, name) => [value, name === "grants" ? "Grants" : name]}
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="grants" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Deadline urgency
          </p>
          <h3 className="mt-2 text-xl font-bold text-blue-950">
            Upcoming application windows
          </h3>
          <div className="mt-5 h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deadlineData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {deadlineData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
          Funding signals
        </p>
        <h3 className="mt-2 text-xl font-bold text-blue-950">
          Maximum funding and average match by category
        </h3>
        <div className="mt-5 h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 8, right: 10, left: -20, bottom: 54 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="category"
                interval={0}
                angle={-28}
                textAnchor="end"
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "totalFunding") return [`$${Math.round(value / 1000)}k`, "Max funding"];
                  return [`${value}%`, "Average match"];
                }}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="totalFunding" fill="#0891b2" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="averageMatch" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
