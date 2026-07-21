import Image from "next/image";
import Link from "next/link";
import FeaturedGrants from "@/components/grants/FeaturedGrants";
import PublicGrantStats from "@/components/grants/PublicGrantStats";

const agentSteps = [
  [
    "Profile Agent",
    "Learns your mission, region, capacity, and prior interactions.",
    "Profile saved",
  ],
  [
    "Discovery Agent",
    "Scans grant sources and applies deterministic filters.",
    "Sources checked",
  ],
  [
    "Eligibility Agent",
    "Scores requirements, evidence gaps, and readiness risks.",
    "Fit explained",
  ],
  [
    "Proposal Agent",
    "Builds an editable outline from approved facts and evidence.",
    "Human approved",
  ],
];

const capabilities = [
  "Grant matching with explainable fit scores",
  "PDF guideline extraction and requirement mapping",
  "Saved opportunities with status and notes",
  "Proposal outlines grounded in approved facts",
  "Agent activity history for transparent review",
  "Exportable briefs for team handoff",
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-blue-950">
        <Image
          src="/images/grantpilot-dashboard-preview.png"
          alt="GrantPilot AI dashboard preview showing grant matches and proposal planning"
          fill
          priority
          className="object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-blue-950/45" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-12 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl py-10 text-white">
            <p className="mb-5 inline-flex rounded-lg border border-cyan-300/40 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              AI funding workspace
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Turn funding opportunities into winning action plans.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50 sm:text-xl sm:leading-8">
              Discover, assess, analyze, and draft in one transparent agent
              workflow built for nonprofits, schools, and mission-driven teams.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/explore"
                className="rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Find opportunities
              </Link>
              <Link
                href="/ai/workspace"
                className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/20"
              >
                Open AI workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicGrantStats />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Featured grants
              </p>
              <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
                Start with high-fit live opportunities.
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
            >
              Explore all grants
            </Link>
          </div>

          <FeaturedGrants />
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              How agents work
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              A transparent path from search to proposal plan.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              GrantPilot separates profile memory, discovery, eligibility, and
              proposal drafting so every recommendation can be traced before it
              becomes content.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.78fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {agentSteps.map(([name, description, signal], index) => (
                  <div
                    key={name}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                        {signal}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-blue-950">
                      {name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm font-bold text-blue-950">
                  Human checkpoint
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Review the evidence, edit generated facts, and approve the
                  proposal direction before anything moves into a final draft.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-blue-950 p-4 text-white shadow-sm sm:p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                Document intelligence
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                Guidelines become a usable action brief.
              </h3>
              <div className="mt-6 space-y-3">
                {[
                  ["Eligibility", "Registered nonprofit, target districts"],
                  ["Required evidence", "Documents mapped from grant guidelines"],
                  ["Key dates", "Deadlines extracted from source materials"],
                  ["Risk flags", "Missing requirements surfaced for review"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/15 bg-white/10 p-4"
                  >
                    <p className="text-xs font-bold uppercase text-cyan-100">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-blue-50">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/ai/documents"
                className="mt-6 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-cyan-50"
              >
                Analyze a document
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              AI capabilities
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              Built for grant teams that need evidence, not guesswork.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 h-2 w-14 rounded-full bg-cyan-400" />
                <p className="font-semibold leading-6 text-slate-800">
                  {capability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-950 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            Approval-first data
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
            Public grant discovery only shows admin-approved opportunities.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-blue-50">
            Funder submissions and seeded grants remain hidden until an admin
            reviews them. Once approved, they automatically appear on the landing
            page, Explore page, and grant seeker dashboard.
          </p>
        </div>
      </section>

      <section id="insights" className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              Grant intelligence
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              Explore live charts and applicant guidance.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              View category trends, funding signals, deadline urgency, and
              expert grant-readiness notes on the dedicated insights page.
            </p>
          </div>
            <Link
              href="/insights"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Open insights
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Ready for the next step
              </p>
              <h2 className="mt-3 text-2xl font-bold text-blue-950 sm:text-3xl">
                Review and approve grant data from the admin dashboard.
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
