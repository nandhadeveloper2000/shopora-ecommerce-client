import { Suspense } from "react";
import AdminCatalogEditScreen from "../edit";

export default function AdminCatalogEditPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
          Loading catalog editor...
        </main>
      }
    >
      <AdminCatalogEditScreen />
    </Suspense>
  );
}
