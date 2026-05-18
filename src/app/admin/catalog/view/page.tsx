import { Suspense } from "react";
import AdminCatalogViewScreen from "../view";

export default function AdminCatalogViewPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
          Loading catalog details...
        </main>
      }
    >
      <AdminCatalogViewScreen />
    </Suspense>
  );
}
