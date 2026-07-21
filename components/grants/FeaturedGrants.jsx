"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

export default function FeaturedGrants() {
  const [grants, setGrants] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadFeaturedGrants = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load grants");
        }

        setGrants(data.slice(0, 3));
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    loadFeaturedGrants();
  }, []);

  if (status === "loading") {
    return (
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-6"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-10 rounded-xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
        Grants could not be loaded from the backend.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {grants.map((grant) => (
        <article
          key={grant._id || grant.slug}
          className="rounded-xl border border-slate-200 bg-slate-50 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
              {grant.category}
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {grant.match}%
            </span>
          </div>
          <h3 className="mt-5 text-xl font-bold text-blue-950">
            {grant.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {grant.summary}
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-sm">
            <span className="font-semibold text-slate-700">{grant.amount}</span>
            <Link
              href={`/grants/${grant.slug}`}
              className="font-bold text-blue-700 transition hover:text-blue-900"
            >
              View details
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
