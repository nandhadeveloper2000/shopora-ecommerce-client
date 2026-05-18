"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { api, authStorage } from "@/lib/api";
import { useStoredUser } from "@/lib/auth-session";

type AdminCrudSection = "create" | "list" | "view" | "edit";

type AdminCrudShellProps = {
  section: AdminCrudSection;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function AdminCrudShell({
  section,
  title,
  description,
  children,
  actions,
}: AdminCrudShellProps) {
  const router = useRouter();
  const user = useStoredUser();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [router, user]);

  const handleLogout = () => {
    startLogoutTransition(() => {
      void (async () => {
        try {
          const refreshToken = authStorage.refreshToken;

          if (refreshToken) {
            await api.post("/auth/logout", { refreshToken });
          }
        } catch {}

        authStorage.clear();
        router.replace("/admin/login");
      })();
    });
  };

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
        Preparing admin pages...
      </main>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
        Checking admin access...
      </main>
    );
  }

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,153,0,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,184,77,0.1),_transparent_24%),linear-gradient(180deg,_#101419_0%,_#1c222b_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <AdminSidebar userName={user.name} />

          <section className="space-y-4">
            <header className="rounded-[2rem] border border-[#ff9900]/15 bg-[#131921] p-6 text-white shadow-[0_24px_80px_-40px_rgba(17,24,39,0.78)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffb84d]">
                    {section === "create"
                      ? "Catalog Creation Workspace"
                      : section === "list"
                        ? "Catalog Record Library"
                        : section === "view"
                          ? "Catalog Detail Viewer"
                          : "Catalog Edit Workspace"}
                  </p>
                  <h1 className="font-display mt-3 text-3xl sm:text-4xl">{title}</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                    {description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Customer Home
                  </Link>
                  {actions}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="rounded-full border border-[#ff9900]/30 px-4 py-2 text-sm font-semibold text-[#ffb84d] transition hover:bg-[#ff9900]/10 disabled:opacity-60"
                  >
                    {isLoggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              </div>
            </header>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
