"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminSidebarSections, isAdminNavItemActive } from "@/lib/admin-navigation";

type AdminSidebarProps = {
  userName: string;
};

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncHash = () => setCurrentHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <aside className="h-fit rounded-[2rem] border border-[#ff9900]/15 bg-[#131921] p-5 text-white shadow-[0_28px_90px_-45px_rgba(17,24,39,0.88)] xl:sticky xl:top-4">
      <div className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ffb84d]">
          Shopora Admin
        </p>
        <h2 className="font-display mt-3 text-3xl">Operations Menu</h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          Logged in as {userName}. Use these connected links to move between the admin dashboard,
          catalog forms, and record management pages.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {adminSidebarSections.map((section) => (
          <section key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              {section.title}
            </p>
            <div className="mt-3 space-y-2">
              {section.items.map((item) => {
                const isActive = isAdminNavItemActive(pathname, currentHash, item);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    scroll
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "border-[#ff9900]/25 bg-[#ff9900]/10 text-white"
                        : "border-white/8 bg-white/4 text-slate-200 hover:bg-white/8"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {item.hint}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[#ff9900]/20 bg-[#232f3e] p-4">
        <p className="text-sm font-semibold text-white">Connected workflow</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          Open the catalog list to choose a record, then continue into the viewer or editor with
          the selected item.
        </p>
        <div className="mt-4 grid gap-2">
          <Link
            href="/admin"
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Admin dashboard overview
          </Link>
          <Link
            href="/admin/catalog/create"
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Create catalog records
          </Link>
          <Link
            href="/admin/catalog/list"
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Browse catalog list
          </Link>
        </div>
      </div>
    </aside>
  );
}
