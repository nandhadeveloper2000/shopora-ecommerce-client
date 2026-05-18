import type {
  AdminCatalogCollections,
  Brand,
  Category,
  CatalogEntityType,
  ProductModel,
  Subcategory,
} from "@/types";

type CatalogEntity = Category | Brand | Subcategory | ProductModel;

const entityLabels: Record<CatalogEntityType, string> = {
  category: "Category",
  brand: "Brand",
  subcategory: "Subcategory",
  model: "Model",
};

export function isCatalogEntityType(value: string | null | undefined): value is CatalogEntityType {
  return value === "category" || value === "brand" || value === "subcategory" || value === "model";
}

export function getCatalogEntityLabel(type: CatalogEntityType) {
  return entityLabels[type];
}

export function getCatalogCollectionByType(
  collections: AdminCatalogCollections,
  type: CatalogEntityType
) {
  switch (type) {
    case "category":
      return collections.categories;
    case "brand":
      return collections.brands;
    case "subcategory":
      return collections.subcategories;
    case "model":
      return collections.models;
  }
}

export function findCatalogEntityById(
  collections: AdminCatalogCollections,
  type: CatalogEntityType,
  id: string
) {
  return getCatalogCollectionByType(collections, type).find((item) => item._id === id) ?? null;
}

export function getSubcategoryCategoryId(subcategory: Subcategory) {
  return typeof subcategory.categoryId === "string"
    ? subcategory.categoryId
    : subcategory.categoryId._id;
}

export function getRelatedEntityName(value: unknown) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_id" in (value as Record<string, unknown>)) {
    return String((value as { name?: string }).name ?? "-");
  }

  return "-";
}

export function getCatalogEntityMedia(entity: CatalogEntity) {
  if ("logo" in entity) {
    return entity.logo?.url ?? null;
  }

  if ("image" in entity) {
    return entity.image?.url ?? null;
  }

  return null;
}
