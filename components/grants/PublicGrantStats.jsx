"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

function isDeadlineSoon(deadline) {
  const diffMs = new Date(`${deadline}T00:00:00`).getTime() - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 45;
}

export default function PublicGrantStats() {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();
        setGrants(response.ok ? data : []);
      } catch {
        setGrants([]);
      }
    };

    loadStats();
  }, []);

  const stats = useMemo(() => {
    const categories = new Set(grants.map((grant) => grant.category).filter(Boolean));
    const highMatches = grants.filter((grant) => Number(grant.match) >= 85);
    const deadlinesSoon = grants.filter((grant) => isDeadlineSoon(grant.deadline));

    return [
      [grants.length, "approved grants"],
      [highMatches.length, "strong matches"],
      [deadlinesSoon.length, "deadlines soon"],
      [categories.size, "categories"],
    ];
  }, [grants]);

  return (
    <section className="-mt-10 border-b border-slate-200 bg-white">
      <div className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-950">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
