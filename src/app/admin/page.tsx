"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminDashboardPayload } from "@/lib/admin-api";
import { api, authStorage, isSessionErrorMessage } from "@/lib/api";
import { useStoredUser } from "@/lib/auth-session";
import { AdminCatalogForms } from "@/app/components/admin-catalog-forms";
import { AdminDashboardMenu } from "@/app/components/admin-dashboard-menu";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import { AdminTopbar } from "@/app/components/admin-topbar";
import type { AdminDashboardPayload } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const user = useStoredUser();
  const [dashboardPayload, setDashboardPayload] = useState<AdminDashboardPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const redirectToLogin = useCallback(() => {
    authStorage.clear();
    router.replace("/admin/login");
  }, [router]);

  const loadDashboard = useCallback(
    async (nextNotice?: string) => {
      setIsLoadingSummary(true);

      try {
        const nextPayload = await fetchAdminDashboardPayload();
        setDashboardPayload(nextPayload);
        setLoadError(null);
        if (nextNotice) {
          setNotice(nextNotice);
        }
      } catch (dashboardError) {
        const errorMessage =
          dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load admin summary right now";

        if (isSessionErrorMessage(errorMessage)) {
          redirectToLogin();
          return;
        }

        setLoadError(errorMessage);
      } finally {
        setIsLoadingSummary(false);
      }
    },
    [redirectToLogin]
  );

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
      return;
    }

    if (!dashboardPayload) {
      const timeoutId = window.setTimeout(() => {
        void loadDashboard();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [dashboardPayload, loadDashboard, router, user]);

  const handleRefresh = () => {
    startRefreshTransition(() => {
      void loadDashboard("Admin summary refreshed successfully");
    });
  };

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
        Preparing admin workspace...
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,153,0,0.12),_transparent_28%),linear-gradient(180deg,_#f7f8fb_0%,_#edf0f5_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <AdminSidebar userName={user.name} />

          <section className="space-y-4">
            <AdminTopbar
              userName={user.name}
              isRefreshing={isRefreshing || isLoadingSummary}
              isLoggingOut={isLoggingOut}
              onRefresh={handleRefresh}
              onLogout={handleLogout}
            />

            {notice && (
              <div className="rounded-2xl border border-[#ff9900]/15 bg-[#ff9900]/10 px-4 py-3 text-sm font-medium text-[#7a3d00]">
                {notice}
              </div>
            )}

            {loadError && (
              <div className="rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-900">
                {loadError}
              </div>
            )}

            {!dashboardPayload ? (
              <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-10 text-center text-sm text-slate-600 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
                Loading connected admin dashboard data...
              </div>
            ) : (
              <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
                <AdminDashboardMenu summary={dashboardPayload.summary} />
                <AdminCatalogForms
                  catalogData={dashboardPayload.catalogData}
                  onMutationComplete={(message) => loadDashboard(message)}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
