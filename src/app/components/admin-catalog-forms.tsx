"use client";

import { useMemo, useState } from "react";
import {
  createAdminBrand,
  createAdminCategory,
  createAdminModel,
  createAdminSubcategory,
} from "@/lib/admin-api";
import type { AdminDashboardPayload, Subcategory } from "@/types";

type AdminCatalogFormsProps = {
  catalogData: AdminDashboardPayload["catalogData"];
  onMutationComplete: (message: string) => Promise<void> | void;
};

function getCategoryIdFromSubcategory(subcategory: Subcategory) {
  return typeof subcategory.categoryId === "string"
    ? subcategory.categoryId
    : subcategory.categoryId._id;
}

type FormCardProps = {
  id?: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function FormCard({ id, title, description, children }: FormCardProps) {
  return (
    <article
      id={id}
      className="scroll-mt-6 rounded-[1.75rem] border border-[#ff9900]/12 bg-white/90 p-5 shadow-[0_16px_60px_-42px_rgba(17,24,39,0.3)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9900]">
        Admin Form
      </p>
      <h3 className="font-display mt-3 text-2xl text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function fileFromInput(event: React.ChangeEvent<HTMLInputElement>) {
  return event.target.files?.[0] ?? null;
}

export function AdminCatalogForms({
  catalogData,
  onMutationComplete,
}: AdminCatalogFormsProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [subcategoryCategoryId, setSubcategoryCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState<File | null>(null);
  const [modelCategoryId, setModelCategoryId] = useState("");
  const [modelSubcategoryId, setModelSubcategoryId] = useState("");
  const [modelBrandId, setModelBrandId] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [savingForm, setSavingForm] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredSubcategories = useMemo(
    () =>
      catalogData.subcategories.filter(
        (subcategory) => getCategoryIdFromSubcategory(subcategory) === modelCategoryId
      ),
    [catalogData.subcategories, modelCategoryId]
  );

  async function runMutation(formKey: string, message: string, action: () => Promise<void>) {
    setSavingForm(formKey);
    setError(null);
    setFeedback(null);

    try {
      await action();
      setFeedback(message);
      await onMutationComplete(message);
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Admin form request failed"
      );
    } finally {
      setSavingForm(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#ff9900]/15 bg-[#131921] p-6 text-white shadow-[0_20px_70px_-45px_rgba(17,24,39,0.82)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb84d]">
          Connected Forms
        </p>
        <h2 className="font-display mt-3 text-3xl">Create catalog records from admin side</h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          These forms are connected directly to backend admin CRUD APIs for categories, brands,
          subcategories, and models.
        </p>
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <FormCard
          id="category-form"
          title="Create Category"
          description="Add a top-level product category with optional image branding."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();

              void runMutation("category", "Category created successfully", async () => {
                await createAdminCategory({
                  name: categoryName,
                  image: categoryImage,
                });

                setCategoryName("");
                setCategoryImage(null);
              });
            }}
          >
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Category name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setCategoryImage(fileFromInput(event))}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
            <button
              type="submit"
              disabled={savingForm === "category"}
              className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60"
            >
              {savingForm === "category" ? "Saving category..." : "Create category"}
            </button>
          </form>
        </FormCard>

        <FormCard
          id="brand-form"
          title="Create Brand"
          description="Add a brand entry and optionally upload the brand logo asset."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();

              void runMutation("brand", "Brand created successfully", async () => {
                await createAdminBrand({
                  name: brandName,
                  logo: brandLogo,
                });

                setBrandName("");
                setBrandLogo(null);
              });
            }}
          >
            <input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="Brand name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setBrandLogo(fileFromInput(event))}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
            <button
              type="submit"
              disabled={savingForm === "brand"}
              className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60"
            >
              {savingForm === "brand" ? "Saving brand..." : "Create brand"}
            </button>
          </form>
        </FormCard>

        <FormCard
          id="subcategory-form"
          title="Create Subcategory"
          description="Connect a subcategory to an existing category and add optional artwork."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();

              void runMutation(
                "subcategory",
                "Subcategory created successfully",
                async () => {
                  await createAdminSubcategory({
                    categoryId: subcategoryCategoryId,
                    name: subcategoryName,
                    image: subcategoryImage,
                  });

                  setSubcategoryCategoryId("");
                  setSubcategoryName("");
                  setSubcategoryImage(null);
                }
              );
            }}
          >
            <select
              value={subcategoryCategoryId}
              onChange={(event) => setSubcategoryCategoryId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            >
              <option value="">Select category</option>
              {catalogData.categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              value={subcategoryName}
              onChange={(event) => setSubcategoryName(event.target.value)}
              placeholder="Subcategory name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSubcategoryImage(fileFromInput(event))}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
            <button
              type="submit"
              disabled={savingForm === "subcategory"}
              className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60"
            >
              {savingForm === "subcategory"
                ? "Saving subcategory..."
                : "Create subcategory"}
            </button>
          </form>
        </FormCard>

        <FormCard
          id="model-form"
          title="Create Model"
          description="Link a model to category, subcategory, and brand in one admin form."
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();

              void runMutation("model", "Model created successfully", async () => {
                await createAdminModel({
                  categoryId: modelCategoryId,
                  subcategoryId: modelSubcategoryId,
                  brandId: modelBrandId,
                  name: modelName,
                  image: modelImage,
                });

                setModelCategoryId("");
                setModelSubcategoryId("");
                setModelBrandId("");
                setModelName("");
                setModelImage(null);
              });
            }}
          >
            <select
              value={modelCategoryId}
              onChange={(event) => {
                setModelCategoryId(event.target.value);
                setModelSubcategoryId("");
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            >
              <option value="">Select category</option>
              {catalogData.categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={modelSubcategoryId}
              onChange={(event) => setModelSubcategoryId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            >
              <option value="">Select subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            <select
              value={modelBrandId}
              onChange={(event) => setModelBrandId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            >
              <option value="">Select brand</option>
              {catalogData.brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <input
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              placeholder="Model name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setModelImage(fileFromInput(event))}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
            <button
              type="submit"
              disabled={savingForm === "model"}
              className="w-full rounded-full bg-[#ff9900] px-5 py-3 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60"
            >
              {savingForm === "model" ? "Saving model..." : "Create model"}
            </button>
          </form>
        </FormCard>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-emerald-700/15 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-900">
          {feedback}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-900">
          {error}
        </div>
      )}
    </div>
  );
}
