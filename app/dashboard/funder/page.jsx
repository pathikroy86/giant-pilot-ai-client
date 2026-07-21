import FunderDashboard from "@/components/dashboard/FunderDashboard";

export const metadata = {
  title: "Funder Dashboard | GrantPilot AI",
  description: "Manage submitted grants, approval status, and applicant review.",
};

export default function FunderDashboardPage() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FunderDashboard />
      </div>
    </section>
  );
}
