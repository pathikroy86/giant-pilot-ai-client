import GrantSeekerDashboard from "@/components/dashboard/GrantSeekerDashboard";

export const metadata = {
  title: "Grant Seeker Dashboard | GrantPilot AI",
  description: "Review grant matches, saved opportunities, and readiness tasks.",
};

export default function DashboardPage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GrantSeekerDashboard />
      </div>
    </section>
  );
}
