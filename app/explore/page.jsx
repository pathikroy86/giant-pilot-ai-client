import ExploreGrants from "@/components/grants/ExploreGrants";

export const metadata = {
  title: "Explore Grants | GrantPilot AI",
  description: "Search, filter, and compare grant opportunities.",
};

export default function ExplorePage() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              Explore grants
            </p>
            <h1 className="mt-3 text-4xl font-bold text-blue-950 sm:text-5xl">
              Find the right opportunity faster.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Search opportunities from MongoDB by sector, funder, deadline,
              and fit. Admin users manage the grant records through protected
              backend API routes.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-blue-950">Approval rule</p>
            <p className="mt-2 text-lg font-bold text-blue-700">Approved only</p>
            <p className="text-sm text-slate-500">Hidden until admin review</p>
          </div>
        </div>

        <ExploreGrants />
      </div>
    </section>
  );
}
