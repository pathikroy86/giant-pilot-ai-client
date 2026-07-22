"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { getBackendAuthToken } from "@/lib/auth-bridge";

const defaultForm = {
  interests: "environment, education, technology",
  region: "United States",
  fundingRange: "$50k-$100k",
  refinement: "Prioritize grants with clear eligibility and near-term proposal readiness.",
};

export default function AIRecommendations() {
  const [formData, setFormData] = useState(defaultForm);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const generateRecommendations = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/ai/recommend`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not generate recommendations");
      }

      setResult(data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
          Recommendation agent
        </p>
        <h2 className="mt-3 text-xl font-bold text-blue-950 sm:text-2xl">
          Refine your grant search.
        </h2>
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="interests">
              Interests
            </label>
            <input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="region">
              Region
            </label>
            <input
              id="region"
              name="region"
              value={formData.region}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="fundingRange">
              Funding range
            </label>
            <select
              id="fundingRange"
              name="fundingRange"
              value={formData.fundingRange}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option>Any</option>
              <option>Under $50k</option>
              <option>$50k-$100k</option>
              <option>$100k+</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="refinement">
              Refinement
            </label>
            <textarea
              id="refinement"
              name="refinement"
              value={formData.refinement}
              onChange={updateField}
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={generateRecommendations}
            disabled={status === "loading"}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {status === "loading" ? "Reasoning..." : result ? "Regenerate recommendations" : "Generate recommendations"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              AI output
            </p>
            <h2 className="mt-3 text-xl font-bold text-blue-950 sm:text-2xl">
              Context-aware recommendations
            </h2>
          </div>
          <Link href="/explore" className="text-sm font-bold text-blue-700">
            Browse approved grants
          </Link>
        </div>

        {message ? (
          <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {message}
          </p>
        ) : null}

        {!result && !message ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 sm:p-10">
            Generate recommendations to see ranked grants with evidence, risks,
            and next actions.
          </div>
        ) : null}

        {result ? (
          <div className="mt-6 space-y-5">
            <p className="rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
              {result.summary}
            </p>
            {result.recommendations?.map((item) => (
              <article key={item.slug} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-blue-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                  </div>
                  <span className="rounded-lg bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-700">
                    {item.score}/100
                  </span>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Evidence</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {item.evidence?.map((evidence) => (
                        <li key={evidence}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Risk</p>
                    <p className="mt-2 text-sm text-slate-600">{item.risk}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Next step</p>
                    <p className="mt-2 text-sm text-slate-600">{item.nextStep}</p>
                  </div>
                </div>
                <Link
                  href={`/grants/${item.slug}`}
                  className="mt-5 inline-flex rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700"
                >
                  View grant
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
