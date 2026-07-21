const policies = [
  [
    "Approved public data",
    "Public grant pages only use opportunities that admins approve for display.",
  ],
  [
    "Private workspace data",
    "Saved grants, eligibility reports, document analyses, and chat history stay tied to the signed-in user.",
  ],
  [
    "AI usage",
    "AI features use the selected provider configuration and should be reviewed before acting on recommendations.",
  ],
];

export const metadata = {
  title: "Privacy | GrantPilot AI",
  description: "GrantPilot AI privacy notes for grant, user, and AI workflow data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
          Clear boundaries for grant and AI workspace data.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
          GrantPilot separates public approved grant discovery from private
          user workspace activity so teams can review data before it appears in
          the UI.
        </p>

        <div className="mt-10 grid gap-4">
          {policies.map(([title, description]) => (
            <section
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold text-blue-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
