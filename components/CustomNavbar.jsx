"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth-client";
import { clearBackendSession } from "@/lib/auth-bridge";

const navLinks = [
  { name: "Explore", href: "/explore" },
  { name: "AI Workspace", href: "/ai/workspace" },
  { name: "Documents", href: "/ai/documents" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Insights", href: "/insights" },
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    await signOut();
    clearBackendSession();
    setUser(null);
    setMenuOpen(false);
  };

  const dashboardHref = dashboardLinks[user?.role] || "/dashboard";
  const isPendingFunder =
    user?.role === "funder" && user.funderApprovalStatus !== "approved";
  const roleLabel = isPendingFunder
    ? "Funder pending"
    : roleLabels[user?.role] || "Member";
  const menuLinks = user
    ? [{ name: "Dashboard", href: dashboardHref }, ...navLinks]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
            G
          </span>
          <span className="text-lg font-bold text-blue-950 sm:text-xl">
            GrantPilot
          </span>
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
          <div className="hidden items-center gap-3 md:flex">
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
          <div className="hidden items-center gap-3 md:flex">
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

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          Menu
        </button>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden"
        >
          <div className="space-y-2">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 px-3 py-3">
                  <p className="truncate text-sm font-bold text-blue-950">
                    Hi, {user.name}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase text-cyan-600">
                    {roleLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
