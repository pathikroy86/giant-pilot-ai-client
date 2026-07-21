import LoginForm from "@/components/auth/LoginForm";

const workspaceItems = [
  "Approved grants are loaded from MongoDB",
  "Role-based dashboards route each user correctly",
  "Admin review controls public grant visibility",
];

export const metadata = {
  title: "Sign In | GrantPilot AI",
  description: "Sign in to your GrantPilot AI workspace.",
};

export default function LoginPage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-bold text-blue-950 sm:text-4xl">
              Sign in to your workspace.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Continue reviewing the workspace your role can access.
            </p>
          </div>
          <LoginForm />
        </div>

        <aside className="flex flex-col justify-center">
          <div className="rounded-xl border border-blue-100 bg-blue-950 p-5 text-white shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Workspace access
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              Your role controls which data and approvals you can manage.
            </h2>
            <div className="mt-8 space-y-4">
              {workspaceItems.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/15 bg-white/10 p-4"
                >
                  <p className="text-sm font-semibold text-blue-50">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Admin", "approve grants"],
              ["Funder", "track review"],
              ["Seeker", "view approved"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-blue-950">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
