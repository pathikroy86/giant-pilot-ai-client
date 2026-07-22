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

function formatFunding(value) {
  return `$${Math.round(Number(value || 0) / 1000)}k`;
}

export default function GrantInsightsCharts() {
  const [insights, setInsights] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/insights`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load insights");
        }

        setInsights(data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    loadInsights();
  }, []);

  const categoryData = insights?.categoryData || [];
  const fundingData = insights?.fundingData || categoryData;
  const deadlineData = insights?.deadlineData || [];
  const summary = insights?.summary || {
    approvedGrants: 0,
    totalFunding: 0,
    averageMatch: 0,
  };
  const hasChartData = useMemo(
    () => categoryData.length > 0 || deadlineData.length > 0,
    [categoryData.length, deadlineData.length],
  );

  if (status === "loading") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (status === "error" || !hasChartData) {
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
          <p className="mt-2 text-3xl font-bold text-blue-950">
            {summary.approvedGrants}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">
            Max funding pool
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-950">
            {formatFunding(summary.totalFunding)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">
            Average match
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-950">
            {summary.averageMatch}%
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
            <BarChart data={fundingData} margin={{ top: 8, right: 10, left: -20, bottom: 54 }}>
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
                  if (name === "totalFunding") return [formatFunding(value), "Max funding"];
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

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
          Database signals
        </p>
        <h3 className="mt-2 text-xl font-bold text-blue-950">
          What the approved grants are showing right now
        </h3>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            [
              "Largest category",
              categoryData[0]
                ? `${categoryData[0].category} with ${categoryData[0].grants} grants`
                : "No category data yet",
            ],
            [
              "Most urgent window",
              deadlineData[0]
                ? `${deadlineData[0].name} has ${deadlineData[0].value} grants`
                : "No deadline data yet",
            ],
            [
              "Funding coverage",
              `${summary.categories || 0} categories total ${formatFunding(summary.totalFunding)}`,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-bold uppercase text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
