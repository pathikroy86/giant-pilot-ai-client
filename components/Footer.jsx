import Link from "next/link";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>GrantPilot AI. Agentic grant discovery and proposal workspace.</p>
        <div className="flex flex-wrap gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium transition hover:text-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
