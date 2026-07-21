"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Explore", href: "/explore" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Insights", href: "/#insights" },
];

const roleLabels = {
  applicant: "Grant seeker",
  funder: "Funder",
  admin: "Admin",
  user: "Member",
};

const dashboardLinks = {
  applicant: "/dashboard",
  funder: "/dashboard/funder",
  admin: "/dashboard/admin",
  user: "/dashboard",
};

export default function CustomNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("grantpilot_user");
      try {
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        localStorage.removeItem("grantpilot_user");
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("grantpilot-auth-changed", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("grantpilot-auth-changed", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("grantpilot_user");
    localStorage.removeItem("grantpilot_auth_token");
    setUser(null);
  };

  const dashboardHref = dashboardLinks[user?.role] || "/dashboard";
  const roleLabel = roleLabels[user?.role] || "Member";
  const menuLinks = user
    ? [{ name: "Dashboard", href: dashboardHref }, ...navLinks]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            G
          </span>
          <span className="text-xl font-bold text-blue-950">GrantPilot</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href={dashboardHref}
              className="hidden max-w-40 truncate text-sm font-semibold text-slate-700 sm:inline"
            >
              Hi, {user.name}
            </Link>
            <span className="hidden rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 md:inline">
              {roleLabel}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-blue-700 sm:inline"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
