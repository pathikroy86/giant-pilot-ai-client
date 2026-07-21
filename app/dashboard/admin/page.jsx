import AdminDashboard from "@/components/dashboard/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | GrantPilot AI",
  description: "Manage GrantPilot AI admin data.",
};

export default function AdminDashboardPage() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminDashboard />
      </div>
    </section>
  );
}
