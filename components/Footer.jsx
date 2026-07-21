import Link from "next/link";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { name: "Explore grants", href: "/explore" },
      { name: "AI workspace", href: "/ai/workspace" },
      { name: "Document intelligence", href: "/ai/documents" },
      { name: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-blue-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-lg font-bold">
              G
            </span>
            <span className="text-xl font-bold">GrantPilot</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-blue-100">
            Agentic grant discovery, approval workflows, and document
            intelligence for teams that need funding decisions grounded in
            evidence.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-bold text-blue-950 transition hover:bg-cyan-50"
            >
              Open dashboard
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/25 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Contact team
            </Link>
          </div>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              {group.title}
            </h2>
            <div className="mt-4 grid gap-3">
              {group.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-blue-100 transition hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-blue-200 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>GrantPilot AI. Human-reviewed funding workflows.</p>
          <p>Built for grant seekers, funders, and admin review teams.</p>
        </div>
      </div>
    </footer>
  );
}
