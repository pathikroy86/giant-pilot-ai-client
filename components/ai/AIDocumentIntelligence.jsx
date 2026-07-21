"use client";

import { useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { getBackendAuthToken } from "@/lib/auth-bridge";

const supportedTypes = ".pdf,.docx,.txt";

function buildReportText(analysis) {
  const sections = [
    `Document Intelligence Report: ${analysis.fileName || "Uploaded document"}`,
    "",
    "Summary",
    analysis.summary || "No summary generated.",
    "",
    "Key Points",
    ...(analysis.keyPoints || []).map((item) => `- ${item}`),
    "",
    "Action Items",
    ...(analysis.actionItems || []).map(
      (item) => `- [${item.priority}] ${item.task} (${item.owner})`,
    ),
    "",
    "Risks",
    ...(analysis.risks || []).map((item) => `- ${item}`),
    "",
    "Tables",
    ...(analysis.tables || []).flatMap((table) => [
      table.title,
      (table.headers || []).join(" | "),
      ...(table.rows || []).map((row) => row.join(" | ")),
      "",
    ]),
  ];

  return sections.join("\n");
}

export default function AIDocumentIntelligence() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const fileLabel = useMemo(() => {
    if (!file) return "Choose a PDF, DOCX, or TXT file";

    return `${file.name} (${Math.ceil(file.size / 1024)} KB)`;
  }, [file]);

  const analyzeDocument = async (event) => {
    event.preventDefault();
    setMessage("");
    setAnalysis(null);

    if (!file) {
      setStatus("error");
      setMessage("Please choose a document first.");
      return;
    }

    try {
      setStatus("loading");
      const token = await getBackendAuthToken();
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(`${getApiBaseUrl()}/api/ai/documents/analyze`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not analyze document");
      }

      setAnalysis(data.analysis);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const blob = new Blob([buildReportText(analysis)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(analysis.fileName || "document").replace(/\.[^/.]+$/, "")}-analysis.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form
        onSubmit={analyzeDocument}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <h2 className="text-xl font-bold text-blue-950 sm:text-2xl">Upload document</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Supported formats: PDF, DOCX, and TXT. Files are processed by the
          backend and saved with your analysis history.
        </p>

        <label
          htmlFor="document"
          className="mt-6 block cursor-pointer rounded-xl border border-dashed border-blue-200 bg-blue-50 p-6 text-center transition hover:bg-blue-100"
        >
          <span className="block text-sm font-bold text-blue-950">
            {fileLabel}
          </span>
          <span className="mt-2 block text-xs font-semibold text-blue-600">
            Click to browse
          </span>
        </label>
        <input
          id="document"
          type="file"
          accept={supportedTypes}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="sr-only"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {status === "loading" ? "Analyzing document..." : "Analyze document"}
        </button>

        {message ? (
          <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {message}
          </p>
        ) : null}
      </form>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
              AI output
            </p>
            <h2 className="mt-3 text-xl font-bold text-blue-950 sm:text-2xl">
              Understanding report
            </h2>
          </div>
          {analysis ? (
            <button
              type="button"
              onClick={downloadReport}
              className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Download report
            </button>
          ) : null}
        </div>

        {!analysis ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 sm:p-10">
            Upload a document to see summaries, key points, extracted tables,
            risks, and action items.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <p className="rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
              {analysis.summary}
            </p>

            {analysis.providerStatus === "rules-preview" ? (
              <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Gemini was not available, so this report uses the local document
                preview analyzer.
              </p>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold uppercase text-blue-950">
                  Key points
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {(analysis.keyPoints || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-bold uppercase text-blue-950">
                  Action items
                </h3>
                <div className="mt-3 space-y-3">
                  {(analysis.actionItems || []).map((item) => (
                    <div
                      key={`${item.task}-${item.priority}`}
                      className="rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <p className="text-sm font-semibold text-slate-700">
                        {item.task}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase text-cyan-600">
                        {item.owner} - {item.priority}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-bold uppercase text-blue-950">
                Extracted tables
              </h3>
              <div className="mt-4 space-y-5">
                {(analysis.tables || []).map((table) => (
                  <div key={table.title} className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-blue-950">
                      {table.title}
                    </div>
                    <table className="w-full min-w-[460px] text-left text-sm sm:min-w-[520px]">
                      {(table.headers || []).length ? (
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                          <tr>
                            {table.headers.map((header) => (
                              <th key={header} className="px-4 py-3">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      ) : null}
                      <tbody className="divide-y divide-slate-100">
                        {(table.rows || []).map((row, index) => (
                          <tr key={`${table.title}-${index}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${cell}-${cellIndex}`} className="px-4 py-3 text-slate-600">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                {(analysis.tables || []).length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
                    No table-like content was detected.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-bold uppercase text-blue-950">
                Risks
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {(analysis.risks || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
