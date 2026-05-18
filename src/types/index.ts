export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface CatalogReference {
  _id: string;
  name: string;
  slug: string;
}

export type CatalogEntityType = "category" | "brand" | "subcategory" | "model";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  avatar?: {
    url: string;
    public_id: string;
  } | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: { url: string; public_id: string } | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Subcategory {
  _id: string;
  categoryId: Category | CatalogReference | string;
  name: string;
  slug: string;
  image?: { url: string; public_id: string } | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: { url: string; public_id: string } | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductModel {
  _id: string;
  categoryId: Category | CatalogReference | string;
  subcategoryId: Subcategory | CatalogReference | string;
  brandId: Brand | CatalogReference | string;
  name: string;
  slug: string;
  image?: { url: string; public_id: string } | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SellerStatusBreakdownItem {
  status: string;
  count: number;
}

export interface AdminRecentSeller {
  _id: string;
  shopName: string;
  businessEmail: string;
  status: string;
  profileCompletion: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminDashboardSummary {
  overview: {
    categories: number;
    brands: number;
    subcategories: number;
    models: number;
    totalSellers: number;
    approvedSellers: number;
    pendingSellerApprovals: number;
    totalCustomers: number;
  };
  sellerStatusBreakdown: SellerStatusBreakdownItem[];
  recentSellers: AdminRecentSeller[];
  recentCatalog: {
    categories: Category[];
    brands: Brand[];
    subcategories: Subcategory[];
    models: ProductModel[];
  };
}

export interface AdminDashboardPayload {
  summary: AdminDashboardSummary;
  catalogData: {
    categories: Category[];
    brands: Brand[];
    subcategories: Subcategory[];
  };
}

export interface AdminCatalogCollections {
  categories: Category[];
  brands: Brand[];
  subcategories: Subcategory[];
  models: ProductModel[];
}
