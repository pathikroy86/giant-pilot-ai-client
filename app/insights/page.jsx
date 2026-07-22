import GrantInsightsCharts from "@/components/insights/GrantInsightsCharts";

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
      </div>
    </section>
  );
}
