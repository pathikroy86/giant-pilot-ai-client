import AIChatAssistant from "@/components/ai/AIChatAssistant";

export const metadata = {
  title: "AI Workspace | GrantPilot AI",
  description: "Chat with a GrantPilot-aware AI assistant.",
};

export default function AIWorkspacePage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            AI workspace
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Chat with your grant assistant.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Ask follow-up questions with conversation memory and approved grant
            context from the database.
          </p>
        </div>
        <AIChatAssistant />
      </div>
    </section>
  );
}
