"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { syncBackendSession } from "@/lib/auth-bridge";
import { getRedirectFromBrowser } from "@/lib/auth-redirect";

const initialFormData = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message || "Could not sign you in");
      }

      const data = await syncBackendSession();
      setStatus("success");
      setMessage(`Welcome back, ${data.user.name}. Your workspace is ready.`);
      router.replace(getRedirectFromBrowser());
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={updateField}
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="amina@example.org"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <Link href="/contact" className="text-xs font-bold text-blue-700">
            Need help?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={updateField}
          required
          minLength={6}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Enter your password"
        />
      </div>

      {message ? (
        <p
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            status === "success"
              ? "bg-cyan-50 text-cyan-800"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {status === "loading" ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-500">
        New to GrantPilot?{" "}
        <Link href="/register" className="font-bold text-blue-700">
          Create an account
        </Link>
      </p>
    </form>
  );
}
