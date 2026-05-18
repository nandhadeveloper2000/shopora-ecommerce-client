"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { api, authStorage } from "@/lib/api";
import { useStoredUser } from "@/lib/auth-session";

const sellerPanels = [
  "Continue onboarding and complete pending business details",
  "Prepare product assortments, pricing, and brand presentation",
  "Track orders, support, and delivery-facing work from one space",
];

export default function SellerPage() {
  const router = useRouter();
  const user = useStoredUser();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (!user || user.role !== "SELLER") {
      router.replace("/seller/login");
    }
  }, [router, user]);

  const handleLogout = () => {
    startTransition(() => {
      void (async () => {
        try {
          const refreshToken = authStorage.refreshToken;

          if (refreshToken) {
            await api.post("/auth/logout", { refreshToken });
          }
        } catch {}
        authStorage.clear();
        router.replace("/seller/login");
      })();
    });
  };

  if (user === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
        Preparing seller workspace...
      </main>
    );
  }

  if (!user || user.role !== "SELLER") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-stone-600">
        Checking seller access...
      </main>
    );
  }

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(180deg,_#f5f7f2_0%,_#e4efe3_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-stone-900/10 bg-white/82 px-6 py-5 shadow-[0_28px_90px_-45px_rgba(28,25,23,0.35)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                Seller Workspace
              </p>
              <h1 className="font-display mt-3 text-3xl text-stone-950 sm:text-4xl">
                Welcome back, {user.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                This route is reserved for seller work such as onboarding, listings, orders, and
                storefront quality.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-stone-900/10 bg-white px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                Customer homepage
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
              >
                {isPending ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            {sellerPanels.map((panel) => (
              <article
                key={panel}
                className="rounded-[1.8rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_20px_60px_-45px_rgba(28,25,23,0.35)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                  Seller task
                </p>
                <h2 className="font-display mt-4 text-3xl leading-tight text-stone-950">
                  {panel}
                </h2>
              </article>
            ))}
          </div>

          <aside className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-white shadow-[0_20px_60px_-45px_rgba(28,25,23,0.7)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Seller path
            </p>
            <h3 className="font-display mt-3 text-3xl">
              Separate route. Separate login. Cleaner internal navigation.
            </h3>
            <div className="mt-6 grid gap-3 text-sm text-stone-200">
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                Seller sign-in happens on `/seller/login`
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                Sellers land in `/seller` after OTP verification
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                Admin controls stay isolated on the `/admin` side
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
