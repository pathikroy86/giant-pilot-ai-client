"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

const fundingRanges = ["Any", "Under $50k", "$50k-$100k", "$100k+"];
const sortOptions = ["Best match", "Deadline", "Funding"];

function matchesFundingRange(grant, range) {
  if (range === "Under $50k") return grant.maxAmount < 50000;
  if (range === "$50k-$100k") return grant.maxAmount >= 50000 && grant.maxAmount <= 100000;
  if (range === "$100k+") return grant.maxAmount > 100000;
  return true;
}

function formatDeadline(deadline) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${deadline}T00:00:00`));
}

export default function ExploreGrants() {
  const [grants, setGrants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fundingRange, setFundingRange] = useState("Any");
  const [sortBy, setSortBy] = useState("Best match");

  useEffect(() => {
    const loadGrants = async () => {
      try {
        setStatus("loading");
        const response = await fetch(`${getApiBaseUrl()}/api/grants`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load grants");
        }

        setGrants(data);
        setStatus("success");
      } catch (loadError) {
        setError(loadError.message);
        setStatus("error");
      }
    };

    loadGrants();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(grants.map((grant) => grant.category).filter(Boolean))];
  }, [grants]);

  const filteredGrants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return grants
      .filter((grant) => {
        const matchesSearch = [grant.title, grant.funder, grant.category, grant.summary]
          .join(" ")
          .toLowerCase()
          .includes(query);
        const matchesCategory = category === "All" || grant.category === category;

        return matchesSearch && matchesCategory && matchesFundingRange(grant, fundingRange);
      })
      .sort((a, b) => {
        if (sortBy === "Deadline") return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === "Funding") return b.maxAmount - a.maxAmount;
        return b.match - a.match;
      });
  }, [category, fundingRange, grants, search, sortBy]);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <label htmlFor="search" className="text-xs font-bold uppercase text-slate-500">
              Search
            </label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by goal, sector, or funder"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="category" className="text-xs font-bold uppercase text-slate-500">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="funding" className="text-xs font-bold uppercase text-slate-500">
              Funding range
            </label>
            <select
              id="funding"
              value={fundingRange}
              onChange={(event) => setFundingRange(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {fundingRanges.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="text-xs font-bold uppercase text-slate-500">
              Sort
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {sortOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing {filteredGrants.length} of {grants.length} opportunities
        </p>
        <div className="flex gap-2">
          {["Open", "High match", "Deadline soon"].map((label) => (
            <span
              key={label}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {status === "loading" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="min-h-80 animate-pulse rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="h-8 w-24 rounded-lg bg-slate-100" />
              <div className="mt-8 h-5 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
              <div className="mt-8 h-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      ) : null}

      {status === "success" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredGrants.map((grant) => (
            <article
              key={grant._id || grant.slug}
              className="flex min-h-80 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                  {grant.status}
                </span>
                <span className="text-2xl font-bold text-blue-700">
                  {grant.match}%
                </span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase text-slate-400">
                {grant.category}
              </p>
              <h2 className="mt-2 text-lg font-bold leading-6 text-blue-950">
                {grant.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {grant.funder}
              </p>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                {grant.summary}
              </p>
              <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Funding</span>
                  <span className="font-bold text-slate-800">{grant.amount}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Deadline</span>
                  <span className="font-bold text-slate-800">
                    {formatDeadline(grant.deadline)}
                  </span>
                </div>
              </div>
              <Link
                href={`/grants/${grant.slug}`}
                className="mt-5 rounded-lg border border-blue-200 px-4 py-2.5 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                View details
              </Link>
            </article>
          ))}
        </div>
      ) : null}

      {status === "success" && filteredGrants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-blue-950">No grants found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try a different search term, category, or funding range.
          </p>
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
          Previous
        </button>
        <div className="flex gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            1
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600">
            2
          </span>
        </div>
        <button className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700">
          Next
        </button>
      </div>
    </div>
  );
}
