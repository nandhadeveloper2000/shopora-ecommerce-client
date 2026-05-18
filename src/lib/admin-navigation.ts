export type AdminNavItem = {
  label: string;
  href: string;
  hint: string;
  matchPath?: string;
  matchHash?: string;
  allowEmptyHash?: boolean;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const adminSidebarSections: AdminNavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Summary Board",
        href: "/admin#summary-board",
        hint: "Live",
        matchPath: "/admin",
        matchHash: "#summary-board",
        allowEmptyHash: true,
      },
      {
        label: "Seller Queue",
        href: "/admin#seller-queue",
        hint: "Queue",
        matchPath: "/admin",
        matchHash: "#seller-queue",
      },
      {
        label: "Recent Activity",
        href: "/admin#recent-activity",
        hint: "Now",
        matchPath: "/admin",
        matchHash: "#recent-activity",
      },
    ],
  },
  {
    title: "Catalog Forms",
    items: [
      {
        label: "Create Category",
        href: "/admin/catalog/create#category-form",
        hint: "Form",
        matchPath: "/admin/catalog/create",
        matchHash: "#category-form",
      },
      {
        label: "Create Brand",
        href: "/admin/catalog/create#brand-form",
        hint: "Form",
        matchPath: "/admin/catalog/create",
        matchHash: "#brand-form",
      },
      {
        label: "Create Subcategory",
        href: "/admin/catalog/create#subcategory-form",
        hint: "Form",
        matchPath: "/admin/catalog/create",
        matchHash: "#subcategory-form",
      },
      {
        label: "Create Model",
        href: "/admin/catalog/create#model-form",
        hint: "Form",
        matchPath: "/admin/catalog/create",
        matchHash: "#model-form",
      },
    ],
  },
  {
    title: "Catalog Pages",
    items: [
      {
        label: "Create Workspace",
        href: "/admin/catalog/create",
        hint: "Page",
        matchPath: "/admin/catalog/create",
      },
      {
        label: "Catalog List",
        href: "/admin/catalog/list",
        hint: "List",
        matchPath: "/admin/catalog/list",
      },
      {
        label: "Record Viewer",
        href: "/admin/catalog/view",
        hint: "Open",
        matchPath: "/admin/catalog/view",
      },
      {
        label: "Record Editor",
        href: "/admin/catalog/edit",
        hint: "Edit",
        matchPath: "/admin/catalog/edit",
      },
    ],
  },
];

export const adminTopbarLinks: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    hint: "Home",
    matchPath: "/admin",
  },
  {
    label: "Create Records",
    href: "/admin/catalog/create",
    hint: "New",
    matchPath: "/admin/catalog/create",
  },
  {
    label: "Catalog List",
    href: "/admin/catalog/list",
    hint: "List",
    matchPath: "/admin/catalog/list",
  },
  {
    label: "Customer Home",
    href: "/",
    hint: "Site",
    matchPath: "/",
  },
];

export function isAdminNavItemActive(
  pathname: string,
  hash: string,
  item: AdminNavItem
) {
  const matchPath = item.matchPath ?? item.href.split("#")[0];

  if (pathname !== matchPath) {
    return false;
  }

  if (!item.matchHash) {
    return true;
  }

  if (!hash && item.allowEmptyHash) {
    return true;
  }

  return hash === item.matchHash;
}
