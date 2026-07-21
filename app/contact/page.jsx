import Link from "next/link";

const contactOptions = [
  ["Applicants", "Get help finding approved grants and preparing evidence."],
  ["Funders", "Ask about submitting opportunities for admin review."],
  ["Admins", "Review approval queues, data quality, and platform setup."],
];

export const metadata = {
  title: "Contact | GrantPilot AI",
  description: "Contact GrantPilot AI for applicant, funder, and admin workflow support.",
};

export default function ContactPage() {
  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Talk to the GrantPilot team.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Choose the workflow you need help with, then continue into the
            right area of the app.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Open dashboard
          </Link>
        </div>

        <div className="grid gap-4">
          {contactOptions.map(([title, description]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <h2 className="text-xl font-bold text-blue-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
