import AIRecommendations from "@/components/ai/AIRecommendations";

export const metadata = {
  title: "AI Recommendations | GrantPilot AI",
  description: "Generate context-aware grant recommendations with AI.",
};

export default function AIRecommendationsPage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Agentic AI
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Smart grant recommendations.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            The recommendation agent analyzes your profile, filters, approved
            grants, and previous interactions to rank opportunities.
          </p>
        </div>
        <AIRecommendations />
      </div>
    </section>
  );
}
