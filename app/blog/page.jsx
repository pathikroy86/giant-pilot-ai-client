import Link from "next/link";

const posts = [
  {
    title: "Why grant data needs an approval checkpoint",
    category: "Admin workflow",
    summary:
      "A short guide to keeping public grant listings accurate, complete, and ready for applicants.",
  },
  {
    title: "How to read eligibility requirements with AI",
    category: "Document intelligence",
    summary:
      "Use document summaries, key points, and action items to prepare stronger application evidence.",
  },
  {
    title: "What funders should prepare before submitting grants",
    category: "Funder onboarding",
    summary:
      "The minimum details that help admins review an opportunity and publish it quickly.",
  },
];

export const metadata = {
  title: "Blog | GrantPilot AI",
  description: "GrantPilot AI articles about grant approval, AI analysis, and funding workflows.",
};

export default function BlogPage() {
  return (
    <div className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
          Blog
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
          Practical notes for better grant decisions.
        </h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase text-cyan-600">
                {post.category}
              </p>
              <h2 className="mt-3 text-xl font-bold leading-7 text-blue-950">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {post.summary}
              </p>
              <Link
                href="/insights"
                className="mt-5 inline-flex text-sm font-bold text-blue-700 transition hover:text-blue-900"
              >
                View related insights
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
