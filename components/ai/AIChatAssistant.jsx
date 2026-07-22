"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";
import { getBackendAuthToken } from "@/lib/auth-bridge";

const openingPrompts = [
  "Which approved grants should I review first?",
  "Help me understand eligibility gaps.",
  "How do I navigate the admin approval workflow?",
];

export default function AIChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I am GrantPilot AI. Ask me about approved grants, eligibility, dashboard navigation, or proposal next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [status, setStatus] = useState("idle");
  const [suggestedPrompts, setSuggestedPrompts] = useState(openingPrompts);
  const [error, setError] = useState("");

  const sendMessage = async (content = input) => {
    const trimmed = content.trim();

    if (!trimmed) return;

    setInput("");
    setError("");
    setStatus("loading");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const token = await getBackendAuthToken();
      const response = await fetch(`${getApiBaseUrl()}/api/ai/chat`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, conversationId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not send message");
      }

      setConversationId(data.conversationId);
      setMessages((current) => [...current, data.message]);
      setSuggestedPrompts(data.suggestedPrompts || openingPrompts);
      setStatus("success");
    } catch (sendError) {
      setError(sendError.message);
      setStatus("error");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-600">
            Chat assistant
          </p>
          <h2 className="mt-2 text-xl font-bold text-blue-950 sm:text-2xl">
            Ask about GrantPilot context.
          </h2>
        </div>

        <div className="max-h-[58vh] min-h-[360px] space-y-4 overflow-y-auto p-4 sm:max-h-[560px] sm:min-h-[460px] sm:p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] overflow-hidden break-words rounded-xl px-4 py-3 text-sm leading-6 sm:max-w-[82%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {status === "loading" ? (
            <div className="flex justify-start">
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
                GrantPilot AI is typing...
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="mx-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 sm:mx-5">
            {error}
          </p>
        ) : null}

        <div className="border-t border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about grants, eligibility, dashboards, or next steps"
              className="min-h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={status === "loading"}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-bold text-blue-950 sm:text-xl">Suggested prompts</h3>
          <div className="mt-4 space-y-3">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-950 p-4 text-white shadow-sm sm:p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            Context used
          </p>
          <p className="mt-3 text-sm leading-6 text-blue-50">
            The assistant uses your account role, conversation history, and
            approved MongoDB grants. It does not expose pending grants.
          </p>
          <Link
            href="/ai/recommendations"
            className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-950"
          >
            Open recommendations
          </Link>
        </div>
      </aside>
    </div>
  );
}
