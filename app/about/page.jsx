import Link from "next/link";

const principles = [
  "Only admin-approved grants appear in public discovery.",
  "AI agents explain fit, risks, and next actions instead of only generating text.",
  "Funder accounts are reviewed before they can publish or manage opportunities.",
];

export const metadata = {
  title: "About | GrantPilot AI",
  description: "Learn how GrantPilot AI supports grant seekers, funders, and approval teams.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50">
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            About GrantPilot
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
            A funding workspace built around trust, review, and practical AI.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">
            GrantPilot helps mission-driven teams discover approved grants,
            analyze requirements, save opportunities, and prepare evidence-based
            next steps with clear human checkpoints.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {principles.map((principle, index) => (
            <div
              key={principle}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="mt-5 font-semibold leading-7 text-slate-800">
                {principle}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-950 py-14 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Workspaces
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Separate dashboards for seekers, funders, and admins.
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-5 py-3 text-center text-sm font-bold text-blue-950 transition hover:bg-cyan-50"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
