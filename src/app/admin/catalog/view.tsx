"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminCrudShell } from "@/app/components/admin-crud-shell";
import { fetchAdminCatalogCollections } from "@/lib/admin-api";
import { authStorage, isSessionErrorMessage } from "@/lib/api";
import {
  findCatalogEntityById,
  getCatalogEntityLabel,
  getCatalogEntityMedia,
  getRelatedEntityName,
  isCatalogEntityType,
} from "@/lib/admin-catalog";
import type { AdminCatalogCollections } from "@/types";

function formatDate(value?: string | null) {
  if (!value) return "Recently";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AdminCatalogViewScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const id = searchParams.get("id");
  const type = isCatalogEntityType(typeParam) ? typeParam : null;

  const [collections, setCollections] = useState<AdminCatalogCollections | null>(null);
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
        loadError instanceof Error ? loadError.message : "Unable to load record details";

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

  const entity = type && id && collections ? findCatalogEntityById(collections, type, id) : null;
  const mediaUrl = entity ? getCatalogEntityMedia(entity) : null;

  return (
    <AdminCrudShell
      section="view"
      title="Catalog Record Details"
      description="Review the selected backend-connected record before moving into the edit workspace."
      actions={
        <Link
          href="/admin/catalog/list"
          className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
        >
          Back to catalog list
        </Link>
      }
    >
      {error && (
        <div className="rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
          {error}
        </div>
      )}

      {!type || !id ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-8 text-sm text-slate-700 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          Select a record from{" "}
          <Link href="/admin/catalog/list" className="font-semibold text-[#ff9900]">
            the catalog list
          </Link>{" "}
          to open its full detail view.
        </div>
      ) : !collections ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-10 text-center text-sm text-slate-600 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          Loading selected record...
        </div>
      ) : !entity ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-8 text-sm text-slate-700 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          The selected record could not be found. Go back to{" "}
          <Link href="/admin/catalog/list" className="font-semibold text-[#ff9900]">
            the catalog list
          </Link>{" "}
          and pick another item.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-[#ff9900]/12 bg-[#131921] p-6 text-white shadow-[0_24px_80px_-45px_rgba(17,24,39,0.88)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb84d]">
              {getCatalogEntityLabel(type)}
            </p>
            <h2 className="font-display mt-3 text-4xl">{entity.name}</h2>
            <p className="mt-3 text-sm text-slate-300">Slug: {entity.slug}</p>
            <p className="mt-2 text-sm text-slate-300">
              Status: {entity.isActive ? "Active" : "Inactive"}
            </p>

            <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5">
              {mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl} alt={entity.name} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                  No media uploaded
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/admin/catalog/edit?type=${type}&id=${entity._id}`}
                className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
              >
                Edit this record
              </Link>
              <Link
                href="/admin/catalog/list"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to catalog list
              </Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-6 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9900]">
              Backend Connected Details
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Created</p>
                <p className="mt-2 text-base text-slate-950">{formatDate(entity.createdAt)}</p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Updated</p>
                <p className="mt-2 text-base text-slate-950">{formatDate(entity.updatedAt)}</p>
              </div>
              {"categoryId" in entity && (
                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Category</p>
                  <p className="mt-2 text-base text-slate-950">
                    {getRelatedEntityName(entity.categoryId)}
                  </p>
                </div>
              )}
              {"subcategoryId" in entity && (
                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Subcategory</p>
                  <p className="mt-2 text-base text-slate-950">
                    {getRelatedEntityName(entity.subcategoryId)}
                  </p>
                </div>
              )}
              {"brandId" in entity && (
                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Brand</p>
                  <p className="mt-2 text-base text-slate-950">
                    {getRelatedEntityName(entity.brandId)}
                  </p>
                </div>
              )}
              {"logo" in entity && (
                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">Logo</p>
                  <p className="mt-2 text-base text-slate-950">{entity.logo ? "Uploaded" : "Not uploaded"}</p>
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </AdminCrudShell>
  );
}
