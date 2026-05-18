"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminCrudShell } from "@/app/components/admin-crud-shell";
import {
  fetchAdminCatalogCollections,
  updateAdminBrand,
  updateAdminCategory,
  updateAdminModel,
  updateAdminSubcategory,
} from "@/lib/admin-api";
import { authStorage, isSessionErrorMessage } from "@/lib/api";
import {
  findCatalogEntityById,
  getCatalogEntityLabel,
  getSubcategoryCategoryId,
  isCatalogEntityType,
} from "@/lib/admin-catalog";
import type { AdminCatalogCollections, Brand, Category, ProductModel, Subcategory } from "@/types";

type BooleanChangeEvent = React.ChangeEvent<HTMLInputElement>;

function fileFromInput(event: React.ChangeEvent<HTMLInputElement>) {
  return event.target.files?.[0] ?? null;
}

type EditFormProps = {
  onSuccess: (message: string) => void;
};

function FieldShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-6 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9900]">Edit Form</p>
      <h2 className="font-display mt-3 text-3xl text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function commonInputClassName() {
  return "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20";
}

function CategoryEditForm({
  category,
  onSuccess,
}: EditFormProps & {
  category: Category;
}) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [isActive, setIsActive] = useState(category.isActive);
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <FieldShell title="Edit Category" description="Update category name, status, or image and save through the backend API.">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSaving(true);
          setError(null);

          void updateAdminCategory({
            id: category._id,
            name,
            isActive,
            image,
          })
            .then(() => {
              onSuccess("Category updated successfully");
              router.push(`/admin/catalog/view?type=category&id=${category._id}`);
            })
            .catch((updateError) => {
              setError(updateError instanceof Error ? updateError.message : "Unable to update category");
            })
            .finally(() => setIsSaving(false));
        }}
      >
        <Field label="Category name">
          <input value={name} onChange={(event) => setName(event.target.value)} className={commonInputClassName()} required />
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={isActive} onChange={(event: BooleanChangeEvent) => setIsActive(event.target.checked)} />
            Active category
          </label>
        </Field>
        <Field label="Replace image">
          <input type="file" accept="image/*" onChange={(event) => setImage(fileFromInput(event))} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600" />
        </Field>
        {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
        <button type="submit" disabled={isSaving} className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60">
          {isSaving ? "Saving category..." : "Save category changes"}
        </button>
      </form>
    </FieldShell>
  );
}

function BrandEditForm({
  brand,
  onSuccess,
}: EditFormProps & {
  brand: Brand;
}) {
  const router = useRouter();
  const [name, setName] = useState(brand.name);
  const [isActive, setIsActive] = useState(brand.isActive);
  const [logo, setLogo] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <FieldShell title="Edit Brand" description="Update the connected brand record and optional logo asset.">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSaving(true);
          setError(null);

          void updateAdminBrand({
            id: brand._id,
            name,
            isActive,
            logo,
          })
            .then(() => {
              onSuccess("Brand updated successfully");
              router.push(`/admin/catalog/view?type=brand&id=${brand._id}`);
            })
            .catch((updateError) => {
              setError(updateError instanceof Error ? updateError.message : "Unable to update brand");
            })
            .finally(() => setIsSaving(false));
        }}
      >
        <Field label="Brand name">
          <input value={name} onChange={(event) => setName(event.target.value)} className={commonInputClassName()} required />
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={isActive} onChange={(event: BooleanChangeEvent) => setIsActive(event.target.checked)} />
            Active brand
          </label>
        </Field>
        <Field label="Replace logo">
          <input type="file" accept="image/*" onChange={(event) => setLogo(fileFromInput(event))} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600" />
        </Field>
        {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
        <button type="submit" disabled={isSaving} className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60">
          {isSaving ? "Saving brand..." : "Save brand changes"}
        </button>
      </form>
    </FieldShell>
  );
}

function SubcategoryEditForm({
  subcategory,
  categories,
  onSuccess,
}: EditFormProps & {
  subcategory: Subcategory;
  categories: Category[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(getSubcategoryCategoryId(subcategory));
  const [name, setName] = useState(subcategory.name);
  const [isActive, setIsActive] = useState(subcategory.isActive);
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <FieldShell title="Edit Subcategory" description="Reconnect this subcategory to a category and update its status or image.">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSaving(true);
          setError(null);

          void updateAdminSubcategory({
            id: subcategory._id,
            categoryId,
            name,
            isActive,
            image,
          })
            .then(() => {
              onSuccess("Subcategory updated successfully");
              router.push(`/admin/catalog/view?type=subcategory&id=${subcategory._id}`);
            })
            .catch((updateError) => {
              setError(updateError instanceof Error ? updateError.message : "Unable to update subcategory");
            })
            .finally(() => setIsSaving(false));
        }}
      >
        <Field label="Parent category">
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={commonInputClassName()} required>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subcategory name">
          <input value={name} onChange={(event) => setName(event.target.value)} className={commonInputClassName()} required />
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={isActive} onChange={(event: BooleanChangeEvent) => setIsActive(event.target.checked)} />
            Active subcategory
          </label>
        </Field>
        <Field label="Replace image">
          <input type="file" accept="image/*" onChange={(event) => setImage(fileFromInput(event))} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600" />
        </Field>
        {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
        <button type="submit" disabled={isSaving} className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60">
          {isSaving ? "Saving subcategory..." : "Save subcategory changes"}
        </button>
      </form>
    </FieldShell>
  );
}

function ModelEditForm({
  model,
  categories,
  brands,
  subcategories,
  onSuccess,
}: EditFormProps & {
  model: ProductModel;
  categories: Category[];
  brands: Brand[];
  subcategories: Subcategory[];
}) {
  const router = useRouter();
  const initialCategoryId =
    typeof model.categoryId === "string" ? model.categoryId : model.categoryId._id;
  const initialSubcategoryId =
    typeof model.subcategoryId === "string" ? model.subcategoryId : model.subcategoryId._id;
  const initialBrandId = typeof model.brandId === "string" ? model.brandId : model.brandId._id;

  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [subcategoryId, setSubcategoryId] = useState(initialSubcategoryId);
  const [brandId, setBrandId] = useState(initialBrandId);
  const [name, setName] = useState(model.name);
  const [isActive, setIsActive] = useState(model.isActive);
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSubcategories = useMemo(
    () => subcategories.filter((subcategory) => getSubcategoryCategoryId(subcategory) === categoryId),
    [categoryId, subcategories]
  );

  return (
    <FieldShell title="Edit Model" description="Edit a model record and keep category, subcategory, and brand relationships aligned.">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSaving(true);
          setError(null);

          void updateAdminModel({
            id: model._id,
            categoryId,
            subcategoryId,
            brandId,
            name,
            isActive,
            image,
          })
            .then(() => {
              onSuccess("Model updated successfully");
              router.push(`/admin/catalog/view?type=model&id=${model._id}`);
            })
            .catch((updateError) => {
              setError(updateError instanceof Error ? updateError.message : "Unable to update model");
            })
            .finally(() => setIsSaving(false));
        }}
      >
        <Field label="Category">
          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setSubcategoryId("");
            }}
            className={commonInputClassName()}
            required
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subcategory">
          <select value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} className={commonInputClassName()} required>
            <option value="">Select subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Brand">
          <select value={brandId} onChange={(event) => setBrandId(event.target.value)} className={commonInputClassName()} required>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Model name">
          <input value={name} onChange={(event) => setName(event.target.value)} className={commonInputClassName()} required />
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={isActive} onChange={(event: BooleanChangeEvent) => setIsActive(event.target.checked)} />
            Active model
          </label>
        </Field>
        <Field label="Replace image">
          <input type="file" accept="image/*" onChange={(event) => setImage(fileFromInput(event))} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600" />
        </Field>
        {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
        <button type="submit" disabled={isSaving} className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60">
          {isSaving ? "Saving model..." : "Save model changes"}
        </button>
      </form>
    </FieldShell>
  );
}

export default function AdminCatalogEditScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const id = searchParams.get("id");
  const type = isCatalogEntityType(typeParam) ? typeParam : null;

  const [collections, setCollections] = useState<AdminCatalogCollections | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
        loadError instanceof Error ? loadError.message : "Unable to load edit data";

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

  return (
    <AdminCrudShell
      section="edit"
      title="Edit Catalog Record"
      description="Update the selected backend-connected category, brand, subcategory, or model from one focused edit workspace."
      actions={
        <Link
          href="/admin/catalog/list"
          className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d]"
        >
          Back to catalog list
        </Link>
      }
    >
      {notice && (
        <div className="rounded-2xl border border-emerald-700/15 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
          {notice}
        </div>
      )}

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
          to open the edit workspace.
        </div>
      ) : !collections ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-10 text-center text-sm text-slate-600 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          Loading edit form...
        </div>
      ) : !entity ? (
        <div className="rounded-[2rem] border border-[#ff9900]/12 bg-white/92 p-8 text-sm text-slate-700 shadow-[0_18px_70px_-45px_rgba(17,24,39,0.28)]">
          The selected {type ? getCatalogEntityLabel(type).toLowerCase() : "record"} could not be found.
        </div>
      ) : (
        <div key={`${type}-${entity._id}`}>
          {type === "category" && (
            <CategoryEditForm
              category={entity as Category}
              onSuccess={(message) => {
                setNotice(message);
                void loadCollections();
              }}
            />
          )}
          {type === "brand" && (
            <BrandEditForm
              brand={entity as Brand}
              onSuccess={(message) => {
                setNotice(message);
                void loadCollections();
              }}
            />
          )}
          {type === "subcategory" && (
            <SubcategoryEditForm
              subcategory={entity as Subcategory}
              categories={collections.categories}
              onSuccess={(message) => {
                setNotice(message);
                void loadCollections();
              }}
            />
          )}
          {type === "model" && (
            <ModelEditForm
              model={entity as ProductModel}
              categories={collections.categories}
              brands={collections.brands}
              subcategories={collections.subcategories}
              onSuccess={(message) => {
                setNotice(message);
                void loadCollections();
              }}
            />
          )}
        </div>
      )}
    </AdminCrudShell>
  );
}
