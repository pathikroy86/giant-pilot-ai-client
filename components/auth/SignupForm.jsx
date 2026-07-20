"use client";

import { useState } from "react";
import Link from "next/link";
import { getApiBaseUrl } from "@/lib/actions/api/base-url";

const initialFormData = {
  name: "",
  email: "",
  organizationName: "",
  organizationType: "Nonprofit",
  password: "",
};

export default function SignupForm() {
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
      const response = await fetch(`${getApiBaseUrl()}/api/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create your account");
      }

      setFormData(initialFormData);
      setStatus("success");
      setMessage("Account created. Your organization profile is ready for grant matching.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={updateField}
          required
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Amina Rahman"
        />
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="organizationName"
            className="text-sm font-semibold text-slate-700"
          >
            Organization
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            value={formData.organizationName}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Bright Blocks"
          />
        </div>

        <div>
          <label
            htmlFor="organizationType"
            className="text-sm font-semibold text-slate-700"
          >
            Type
          </label>
          <select
            id="organizationType"
            name="organizationType"
            value={formData.organizationType}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option>Nonprofit</option>
            <option>School</option>
            <option>Social enterprise</option>
            <option>Municipality</option>
            <option>Community group</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={updateField}
          required
          minLength={6}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="At least 6 characters"
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
        {status === "loading" ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-blue-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
