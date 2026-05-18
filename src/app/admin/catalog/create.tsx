"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminCrudShell } from "@/app/components/admin-crud-shell";
import { AdminCatalogForms } from "@/app/components/admin-catalog-forms";
import { fetchAdminDashboardPayload } from "@/lib/admin-api";
import { authStorage, isSessionErrorMessage } from "@/lib/api";
import type { AdminDashboardPayload } from "@/types";

export default function AdminCatalogCreateScreen() {
  const router = useRouter();
  const [dashboardPayload, setDashboardPayload] = useState<AdminDashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectToLogin = useCallback(() => {
    authStorage.clear();
    router.replace("/admin/login");
  }, [router]);

  const loadPayload = useCallback(
    async (noticeMessage?: string) => {
      try {
        const nextPayload = await fetchAdminDashboardPayload();
        setDashboardPayload(nextPayload);
        setError(null);
        void noticeMessage;
      } catch (loadError) {
        const errorMessage =
          loadError instanceof Error ? loadError.message : "Unable to load create form data";

        if (isSessionErrorMessage(errorMessage)) {
          redirectToLogin();
          return;
        }

        setError(errorMessage);
      }
    },
    [redirectToLogin]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPayload();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPayload]);

  return (
    <AdminCrudShell
      section="create"
      title="Create Catalog Records"
      description="Use the connected admin forms to add categories, brands, subcategories, and models from one workspace."
      actions={
        <Link
          href="/admin/catalog/list"
          className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
        >
          Open catalog list
        </Link>
      }
    >
      {error && (
        <div className="rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
          {error}
        </div>
      )}

      {!dashboardPayload ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-10 text-center text-sm text-slate-600 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          Loading create forms...
        </div>
      ) : (
        <AdminCatalogForms
          catalogData={dashboardPayload.catalogData}
          onMutationComplete={() => loadPayload()}
        />
      )}
    </AdminCrudShell>
  );
}
