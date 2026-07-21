"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const roleLabels = {
  admin: "admin",
  funder: "funder",
  applicant: "grant seeker",
};

export default function RoleGate({ allowedRoles, children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedUser = localStorage.getItem("grantpilot_user");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setUser(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (user === undefined) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-8">
        <h2 className="text-2xl font-bold text-blue-950">Sign in required</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-800">
          This dashboard uses your account role to show the right workspace.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-8">
        <h2 className="text-2xl font-bold text-blue-950">Wrong dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-red-700">
          You are signed in as {roleLabels[user.role] || "a member"}, but this
          page is for {allowedRoles.map((role) => roleLabels[role]).join(", ")}.
        </p>
      </div>
    );
  }

  return children;
}
