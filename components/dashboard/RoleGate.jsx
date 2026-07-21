"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { syncBackendSession } from "@/lib/auth-bridge";

const roleLabels = {
  admin: "admin",
  funder: "funder",
  applicant: "grant seeker",
};

export default function RoleGate({ allowedRoles, children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("grantpilot_user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
          return;
        }

        const data = await syncBackendSession();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("grantpilot-auth-changed", loadUser);

    return () => {
      window.removeEventListener("grantpilot-auth-changed", loadUser);
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 sm:p-8">
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
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 sm:p-8">
        <h2 className="text-2xl font-bold text-blue-950">Wrong dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-red-700">
          You are signed in as {roleLabels[user.role] || "a member"}, but this
          page is for {allowedRoles.map((role) => roleLabels[role]).join(", ")}.
        </p>
      </div>
    );
  }

  if (
    user.role === "funder" &&
    allowedRoles.includes("funder") &&
    (user.funderApprovalStatus || "pending") !== "approved"
  ) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
          Approval pending
        </p>
        <h2 className="mt-3 text-2xl font-bold text-blue-950">
          Your funder account is waiting for admin approval.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-800">
          After an admin approves your funder registration, this dashboard will
          unlock so you can manage grant submissions and approval status.
        </p>
        <Link
          href="/explore"
          className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          Browse approved grants
        </Link>
      </div>
    );
  }

  return children;
}
