import Image from "next/image";
import Link from "next/link";

const featuredGrants = [
  {
    title: "Community Solar Innovation Fund",
    category: "Environment",
    amount: "$20k-$80k",
    deadline: "Due in 18 days",
    match: "92%",
    summary:
      "Capital and planning support for locally led clean-energy access projects.",
  },
  {
    title: "Youth Skills Accelerator",
    category: "Education",
    amount: "$10k-$40k",
    deadline: "Due in 26 days",
    match: "91%",
    summary:
      "Workforce readiness grants for nonprofits serving young adults.",
  },
  {
    title: "Digital Access Fund",
    category: "Technology",
    amount: "$35k-$120k",
    deadline: "Due in 34 days",
    match: "87%",
    summary:
      "Infrastructure and training funds for community broadband inclusion.",
  },
];

const agentSteps = [
  ["Profile Agent", "Learns your mission, region, capacity, and prior activity."],
  ["Discovery Agent", "Scans grant sources and applies deterministic filters."],
  ["Eligibility Agent", "Scores requirements, evidence gaps, and readiness risks."],
  ["Proposal Agent", "Builds an editable, fact-grounded proposal outline."],
];

const capabilities = [
  "Grant matching with explainable fit scores",
  "PDF guideline extraction and requirement mapping",
  "Saved opportunities with status and notes",
  "Proposal outlines grounded in approved facts",
  "Agent activity history for transparent review",
  "Exportable briefs for team handoff",
];

const metrics = [
  ["128", "grants scanned"],
  ["14", "strong matches"],
  ["72%", "draft readiness"],
  ["4", "agent tools"],
];

const stories = [
  {
    quote:
      "GrantPilot helped our small team focus on the three opportunities we could actually win.",
    name: "Amina Rahman",
    role: "Program Director, Bright Blocks",
  },
  {
    quote:
      "The eligibility report surfaced missing evidence before we wasted days drafting.",
    name: "Jon Bell",
    role: "Operations Lead, Civic Roots",
  },
];

const insights = [
  "How to read a grant deadline like a project manager",
  "What funders mean by measurable community resilience",
  "A practical evidence checklist for first-time applicants",
];

const faqs = [
  [
    "Can I use demo data first?",
    "Yes. The first build uses demo grants so the experience can be designed before connecting live data.",
  ],
  [
    "Does the AI submit grants automatically?",
    "No. GrantPilot keeps a human approval checkpoint before proposal export or submission.",
  ],
  [
    "What files can the document agent read?",
    "The planned workflow supports PDF, DOCX, and TXT guideline uploads up to 15 MB.",
  ],
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
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl py-10 text-white">
            <p className="mb-5 inline-flex rounded-lg border border-cyan-300/40 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-100">
              AI funding workspace
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Turn funding opportunities into winning action plans.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
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

      <section className="-mt-10 border-b border-slate-200 bg-white">
        <div className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {metrics.map(([value, label]) => (
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Featured grants
              </p>
              <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
                Start with high-fit demo opportunities.
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
            >
              Explore all grants
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredGrants.map((grant) => (
              <article
                key={grant.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-lg bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                    {grant.category}
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    {grant.match}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-blue-950">
                  {grant.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {grant.summary}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-sm">
                  <span className="font-semibold text-slate-700">
                    {grant.amount}
                  </span>
                  <span className="text-slate-500">{grant.deadline}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              How agents work
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              One workflow, four focused agents, human approval.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              GrantPilot separates discovery, eligibility, and drafting so every
              recommendation can be reviewed before it becomes proposal content.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {agentSteps.map(([name, description], index) => (
              <div
                key={name}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-blue-950">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
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

      <section className="bg-blue-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Success metrics
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              See why a grant is worth your team&apos;s time.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stories.map((story) => (
              <figure
                key={story.name}
                className="rounded-xl border border-white/15 bg-white/10 p-6"
              >
                <blockquote className="text-base leading-7 text-blue-50">
                  &quot;{story.quote}&quot;
                </blockquote>
                <figcaption className="mt-5">
                  <p className="font-bold">{story.name}</p>
                  <p className="text-sm text-blue-100">{story.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
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
                  href="/blog"
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
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-slate-200 bg-slate-50 p-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
                Ready for the next step
              </p>
              <h2 className="mt-3 text-3xl font-bold text-blue-950">
                Connect the grant domain when you are ready.
              </h2>
            </div>
            <Link
              href="/register"
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
