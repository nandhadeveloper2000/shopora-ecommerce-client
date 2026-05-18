"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { api, authStorage } from "@/lib/api";
import type { ApiResponse, AuthPayload } from "@/types";

export default function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRequestOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        setFeedback(null);
        setError(null);

        try {
          const response = await api.post<ApiResponse<{ email: string; purpose: string }>>(
            "/auth/send-otp",
            {
              email,
              purpose: "LOGIN",
            }
          );

          setOtpRequested(true);
          setFeedback(response.message);
        } catch (requestError) {
          setError(
            requestError instanceof Error ? requestError.message : "Unable to send seller OTP"
          );
        }
      })();
    });
  };

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        setFeedback(null);
        setError(null);

        try {
          const response = await api.post<ApiResponse<AuthPayload>>("/auth/verify-otp", {
            email,
            otp,
            purpose: "LOGIN",
          });

          if (response.data.user.role !== "SELLER") {
            authStorage.clear();
            setError("This portal only allows seller accounts.");
            return;
          }

          authStorage.save(response.data);
          setFeedback("Seller login successful. Opening your workspace...");
          router.push("/seller");
        } catch (verifyError) {
          setError(verifyError instanceof Error ? verifyError.message : "Seller OTP failed");
        }
      })();
    });
  };

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_28%),linear-gradient(180deg,_#f6f5f0_0%,_#e9efe8_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              Seller Portal
            </p>
            <h1 className="font-display mt-3 text-3xl text-stone-950 sm:text-4xl">
              Separate seller login route
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
              href="/admin/login"
              className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Admin portal
            </Link>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <aside className="rounded-[2rem] border border-stone-900/10 bg-white/78 p-8 shadow-[0_28px_90px_-46px_rgba(28,25,23,0.35)] backdrop-blur">
            <span className="inline-flex rounded-full border border-emerald-700/15 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800">
              Separate seller route
            </span>
            <h2 className="font-display mt-5 text-4xl leading-tight text-stone-950">
              Continue onboarding, manage listings, and keep your store moving.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-stone-600">
              Seller access now lives on its own URL and uses the existing OTP flow, separate from
              the admin password route.
            </p>

            <div className="mt-8 grid gap-3">
              {["Business onboarding", "Catalog updates", "Order handling"].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-stone-900/10 bg-white px-4 py-3 text-sm font-medium text-stone-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-6 rounded-[2rem] border border-stone-900/10 bg-stone-950/95 p-7 text-white shadow-[0_32px_100px_-48px_rgba(28,25,23,0.78)] sm:p-8 lg:grid-cols-2">
            <form
              onSubmit={handleRequestOtp}
              className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Step 1
              </p>
              <h3 className="font-display mt-3 text-2xl">Request OTP</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Use the seller account email connected to your Shopora profile.
              </p>

              <label className="mt-6 block text-sm font-semibold text-stone-100" htmlFor="email">
                Seller email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your seller email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />

              <button
                type="submit"
                disabled={isPending}
                className="mt-6 w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Sending OTP..." : "Send seller OTP"}
              </button>
            </form>

            <form
              onSubmit={handleVerifyOtp}
              className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Step 2
              </p>
              <h3 className="font-display mt-3 text-2xl">Verify OTP</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300">
                Confirm the code and continue into the separate seller workspace.
              </p>

              <label className="mt-6 block text-sm font-semibold text-stone-100" htmlFor="otp">
                One-time password
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="6-digit OTP"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm tracking-[0.25em] text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />

              <button
                type="submit"
                disabled={isPending || !otpRequested}
                className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Verifying..." : "Open seller workspace"}
              </button>
            </form>

            {feedback && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100 lg:col-span-2">
                {feedback}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-100 lg:col-span-2">
                {error}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
