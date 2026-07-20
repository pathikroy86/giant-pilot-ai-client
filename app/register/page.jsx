import SignupForm from "@/components/auth/SignupForm";

const benefits = [
  "Save grants and track readiness",
  "Run eligibility checks against your organization profile",
  "Prepare proposal outlines with approved facts",
];

export const metadata = {
  title: "Create Account | GrantPilot AI",
  description: "Create your GrantPilot AI account and start matching grants.",
};

export default function RegisterPage() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Join GrantPilot
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Create your grant workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Start with your organization profile so GrantPilot can rank grants,
            explain eligibility, and prepare stronger proposal plans.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-cyan-400" />
                <p className="font-semibold text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-blue-950">Demo workflow</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Profile", "Match", "Draft"].map((step, index) => (
                <div key={step} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold text-cyan-600">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 font-bold text-blue-950">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-950">Sign up</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your account will be stored in MongoDB and used for future
              personalized grant recommendations.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
