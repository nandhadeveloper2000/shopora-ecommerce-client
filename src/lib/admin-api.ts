import { api } from "@/lib/api";
import type {
  AdminCatalogCollections,
  AdminDashboardPayload,
  ApiResponse,
  Brand,
  Category,
  ProductModel,
  Subcategory,
} from "@/types";

function buildFormData(
  fields: Record<string, string | boolean | File | null | undefined>
) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, typeof value === "boolean" ? String(value) : value);
  });

  return formData;
}

export async function fetchAdminDashboardPayload() {
  const response = await api.get<ApiResponse<AdminDashboardPayload>>(
    "/admin/dashboard/summary"
  );

  return response.data;
}

export async function fetchAdminCatalogCollections(): Promise<AdminCatalogCollections> {
  const [categoriesResponse, brandsResponse, subcategoriesResponse, modelsResponse] =
    await Promise.all([
      api.get<ApiResponse<{ categories: Category[] }>>("/categories"),
      api.get<ApiResponse<{ brands: Brand[] }>>("/brands"),
      api.get<ApiResponse<{ subcategories: Subcategory[] }>>("/subcategories"),
      api.get<ApiResponse<{ models: ProductModel[] }>>("/models"),
    ]);

  return {
    categories: categoriesResponse.data.categories,
    brands: brandsResponse.data.brands,
    subcategories: subcategoriesResponse.data.subcategories,
    models: modelsResponse.data.models,
  };
}

export async function createAdminCategory(input: {
  name: string;
  image?: File | null;
}) {
  const response = await api.post<ApiResponse<{ category: Category }>>(
    "/categories",
    buildFormData({
      name: input.name,
      image: input.image,
    })
  );

  return response.data.category;
}

export async function createAdminBrand(input: {
  name: string;
  logo?: File | null;
}) {
  const response = await api.post<ApiResponse<{ brand: Brand }>>(
    "/brands",
    buildFormData({
      name: input.name,
      logo: input.logo,
    })
  );

  return response.data.brand;
}

export async function createAdminSubcategory(input: {
  categoryId: string;
  name: string;
  image?: File | null;
}) {
  const response = await api.post<ApiResponse<{ subcategory: Subcategory }>>(
    "/subcategories",
    buildFormData({
      categoryId: input.categoryId,
      name: input.name,
      image: input.image,
    })
  );

  return response.data.subcategory;
}

export async function createAdminModel(input: {
  categoryId: string;
  subcategoryId: string;
  brandId: string;
  name: string;
  image?: File | null;
}) {
  const response = await api.post<ApiResponse<{ model: ProductModel }>>(
    "/models",
    buildFormData({
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      brandId: input.brandId,
      name: input.name,
      image: input.image,
    })
  );

  return response.data.model;
}

export async function updateAdminCategory(input: {
  id: string;
  name: string;
  isActive: boolean;
  image?: File | null;
}) {
  const response = await api.put<ApiResponse<{ category: Category }>>(
    `/categories/${input.id}`,
    buildFormData({
      name: input.name,
      isActive: input.isActive,
      image: input.image,
    })
  );

  return response.data.category;
}

export async function updateAdminBrand(input: {
  id: string;
  name: string;
  isActive: boolean;
  logo?: File | null;
}) {
  const response = await api.put<ApiResponse<{ brand: Brand }>>(
    `/brands/${input.id}`,
    buildFormData({
      name: input.name,
      isActive: input.isActive,
      logo: input.logo,
    })
  );

  return response.data.brand;
}

export async function updateAdminSubcategory(input: {
  id: string;
  categoryId: string;
  name: string;
  isActive: boolean;
  image?: File | null;
}) {
  const response = await api.put<ApiResponse<{ subcategory: Subcategory }>>(
    `/subcategories/${input.id}`,
    buildFormData({
      categoryId: input.categoryId,
      name: input.name,
      isActive: input.isActive,
      image: input.image,
    })
  );

  return response.data.subcategory;
}

export async function updateAdminModel(input: {
  id: string;
  categoryId: string;
  subcategoryId: string;
  brandId: string;
  name: string;
  isActive: boolean;
  image?: File | null;
}) {
  const response = await api.put<ApiResponse<{ model: ProductModel }>>(
    `/models/${input.id}`,
    buildFormData({
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      brandId: input.brandId,
      name: input.name,
      isActive: input.isActive,
      image: input.image,
    })
  );

  return response.data.model;
}
