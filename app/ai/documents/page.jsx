import AIDocumentIntelligence from "@/components/ai/AIDocumentIntelligence";

export const metadata = {
  title: "Document Intelligence | GrantPilot AI",
  description: "Analyze proposal and grant documents with AI.",
};

export default function AIDocumentsPage() {
  return (
    <section className="bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Document intelligence
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-blue-950 sm:text-5xl">
            Analyze grant documents.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Upload PDF, DOCX, or TXT files to generate summaries, key points,
            table extraction, risks, and action items.
          </p>
        </div>

        <AIDocumentIntelligence />
      </div>
    </section>
  );
}
