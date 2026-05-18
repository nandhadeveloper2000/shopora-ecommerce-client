"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminCrudShell } from "@/app/components/admin-crud-shell";
import { fetchAdminCatalogCollections } from "@/lib/admin-api";
import { authStorage, isSessionErrorMessage } from "@/lib/api";
import {
  getCatalogCollectionByType,
  getCatalogEntityLabel,
  getCatalogEntityMedia,
  getRelatedEntityName,
} from "@/lib/admin-catalog";
import type { AdminCatalogCollections, CatalogEntityType } from "@/types";

const entityTypes: CatalogEntityType[] = ["category", "brand", "subcategory", "model"];

function formatDate(value?: string | null) {
  if (!value) return "Recently";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AdminCatalogListScreen() {
  const router = useRouter();
  const [collections, setCollections] = useState<AdminCatalogCollections | null>(null);
  const [selectedType, setSelectedType] = useState<CatalogEntityType>("category");
  const [error, setError] = useState<string | null>(null);

  const redirectToLogin = useCallback(() => {
    authStorage.clear();
    router.replace("/admin/login");
  }, [router]);

  const loadCollections = useCallback(async () => {
    try {
      const nextCollections = await fetchAdminCatalogCollections();
      setCollections(nextCollections);
      setError(null);
    } catch (loadError) {
      const errorMessage =
        loadError instanceof Error ? loadError.message : "Unable to load list data";

      if (isSessionErrorMessage(errorMessage)) {
        redirectToLogin();
        return;
      }

      setError(errorMessage);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCollections();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCollections]);

  const currentItems = useMemo(() => {
    if (!collections) {
      return [];
    }

    return getCatalogCollectionByType(collections, selectedType);
  }, [collections, selectedType]);

  return (
    <AdminCrudShell
      section="list"
      title="Catalog List"
      description="Browse backend-connected catalog records and jump into the viewer or editor for any item."
      actions={
        <Link
          href="/admin/catalog/create"
          className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
        >
          Create new record
        </Link>
      }
    >
      <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-5 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
        <div className="flex flex-wrap gap-3">
          {entityTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedType === type
                  ? "bg-[#131921] text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {getCatalogEntityLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
          {error}
        </div>
      )}

      {!collections ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-10 text-center text-sm text-slate-600 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          Loading list data...
        </div>
      ) : (
        <div className="grid gap-4">
          {currentItems.map((item) => {
            const mediaUrl = getCatalogEntityMedia(item);

            return (
              <article
                key={item._id}
                className="rounded-[1.75rem] border border-[#ff9900]/12 bg-white/92 p-5 shadow-[0_16px_60px_-42px_rgba(17,24,39,0.25)]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#131921] text-sm font-semibold text-[#ffb84d]">
                      {mediaUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mediaUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        item.name.slice(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9900]">
                        {getCatalogEntityLabel(selectedType)}
                      </p>
                      <h2 className="font-display mt-2 text-3xl text-slate-950">{item.name}</h2>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                        <span>Slug: {item.slug}</span>
                        <span>Status: {item.isActive ? "Active" : "Inactive"}</span>
                        {"categoryId" in item && selectedType !== "category" && (
                          <span>Category: {getRelatedEntityName(item.categoryId)}</span>
                        )}
                        {"brandId" in item && (
                          <span>Brand: {getRelatedEntityName(item.brandId)}</span>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        Updated {formatDate(item.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/catalog/view?type=${selectedType}&id=${item._id}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View details
                    </Link>
                    <Link
                      href={`/admin/catalog/edit?type=${selectedType}&id=${item._id}`}
                      className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
                    >
                      Edit record
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {currentItems.length === 0 && (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/88 p-8 text-center text-sm text-slate-600">
              No {getCatalogEntityLabel(selectedType).toLowerCase()} records found yet.
            </div>
          )}
        </div>
      )}
    </AdminCrudShell>
  );
}
