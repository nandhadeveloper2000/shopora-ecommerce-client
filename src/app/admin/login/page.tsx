"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { api, authStorage } from "@/lib/api";
import type { ApiResponse, AuthPayload } from "@/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        setFeedback(null);
        setError(null);

        try {
          const response = await api.post<ApiResponse<AuthPayload>>("/auth/admin-login", {
            email,
            password,
          });

          if (response.data.user.role !== "ADMIN") {
            authStorage.clear();
            setError("This login only allows admin accounts.");
            return;
          }

          authStorage.save(response.data);
          setFeedback("Admin login successful. Opening your control room...");
          router.push("/admin");
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : "Admin login failed");
        }
      })();
    });
  };

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_26%),linear-gradient(180deg,_#f8f3eb_0%,_#f1e6d8_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
              Admin Portal
            </p>
            <h1 className="font-display mt-3 text-3xl text-stone-950 sm:text-4xl">
              Marketplace control login
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-stone-900/10 bg-white/80 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              Customer homepage
            </Link>
            <Link
              href="/seller/login"
              className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Seller portal
            </Link>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <aside className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-8 text-white shadow-[0_32px_100px_-48px_rgba(28,25,23,0.88)]">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
              Separate admin route
            </span>
            <h2 className="font-display mt-5 text-4xl leading-tight">
              Review sellers, guide approvals, and keep the whole market healthy.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-stone-300">
              This portal is isolated from the storefront and seller login so internal operations
              feel controlled, focused, and clearly role-specific.
            </p>

            <div className="mt-8 grid gap-3">
              {["Seller approvals", "Catalog moderation", "Marketplace controls"].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-stone-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-stone-900/10 bg-white/82 p-7 shadow-[0_28px_90px_-46px_rgba(28,25,23,0.45)] backdrop-blur sm:p-8"
          >
            <div className="border-b border-stone-900/10 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
                Secure access
              </p>
              <h3 className="font-display mt-3 text-3xl text-stone-950">
                Sign in with admin credentials
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                This uses a dedicated password login route on the server, separate from seller OTP
                access.
              </p>
            </div>

            <label className="mt-6 block text-sm font-semibold text-stone-800" htmlFor="email">
              Admin email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your admin email"
              className="mt-2 w-full rounded-2xl border border-stone-900/10 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              required
            />

            <label
              className="mt-5 block text-sm font-semibold text-stone-800"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-stone-900/10 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              required
            />

            <button
              type="submit"
              disabled={isPending}
              className="mt-7 w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in..." : "Open admin portal"}
            </button>

            {feedback && (
              <div className="mt-5 rounded-2xl border border-emerald-700/15 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-900">
                {feedback}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-700/15 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-900">
                {error}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
