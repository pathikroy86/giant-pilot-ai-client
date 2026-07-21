import Link from "next/link";
import GrantInsightsCharts from "@/components/insights/GrantInsightsCharts";

const insights = [
  "How to read a grant deadline like a project manager",
  "What funders mean by measurable community resilience",
  "A practical evidence checklist for first-time applicants",
];

const faqs = [
  [
    "Why do grants need admin approval?",
    "Only approved grants are returned by the public API, which keeps low-quality or incomplete listings out of the UI.",
  ],
  [
    "Does the AI submit grants automatically?",
    "No. GrantPilot keeps a human approval checkpoint before proposal export or submission.",
  ],
  [
    "What files can the document agent read?",
    "The workflow supports PDF, DOCX, and TXT guideline uploads.",
  ],
];

export const metadata = {
  title: "Insights | GrantPilot AI",
  description: "Review approved grant trends and applicant guidance.",
};

export default function InsightsPage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Grant intelligence
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Live insights from approved grant data.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These charts use the same MongoDB-approved grants that power
            Explore, dashboards, and AI matching.
          </p>
        </div>

        <GrantInsightsCharts />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              Expert insights
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              Learn the habits of stronger grant applicants.
            </h2>
            <div className="mt-8 space-y-3">
              {insights.map((insight) => (
                <Link
                  key={insight}
                  href="/insights"
                  className="block rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700"
                >
                  {insight}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              FAQ
            </p>
            <div className="mt-6 space-y-4">
              {faqs.map(([question, answer]) => (
                <div
                  key={question}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="font-bold text-blue-950">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
