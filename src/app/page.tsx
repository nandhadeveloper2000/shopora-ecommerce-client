import Link from "next/link";

const discoveryLanes = [
  {
    eyebrow: "Trending now",
    title: "Fast-moving essentials with clear pricing and cleaner discovery.",
    accent: "from-sky-500/20 via-cyan-400/10 to-transparent",
  },
  {
    eyebrow: "Creator market",
    title: "Independent sellers with standout products, sharp photography, and better stories.",
    accent: "from-emerald-500/20 via-lime-400/10 to-transparent",
  },
  {
    eyebrow: "Express picks",
    title: "High-conversion items promoted through a fast, trust-first landing experience.",
    accent: "from-amber-500/20 via-orange-400/10 to-transparent",
  },
];

const commerceSignals = [
  { value: "50k+", label: "skus grouped into faster browsing lanes" },
  { value: "1.2k", label: "seller operations managed from separate portals" },
  { value: "98%", label: "order support routed without homepage clutter" },
];

const brandStories = [
  {
    title: "Clearer category entry",
    copy: "Large-entry pathways help shoppers jump into demand-heavy categories in one tap instead of scanning dense menus.",
  },
  {
    title: "Editorial product framing",
    copy: "Hero sections feel promotional and premium, not like a generic starter ecommerce template.",
  },
  {
    title: "Separate business portals",
    copy: "Admin and seller flows sit outside the storefront so the homepage stays focused on customers.",
  },
];

const shopperBlocks = [
  "Daily deal theatre",
  "Top rated seller lanes",
  "Brand-led feature panels",
  "Trust, delivery, and return cues",
];

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_34%),linear-gradient(180deg,_rgba(251,247,240,1)_0%,_rgba(244,236,224,1)_100%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-stone-900/10 bg-white/70 px-5 py-4 shadow-[0_24px_80px_-40px_rgba(28,25,23,0.45)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
                Shopora Marketplace
              </p>
              <h1 className="font-display mt-3 text-3xl text-stone-950 sm:text-4xl">
                Homepage route for the customer side
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/login"
                className="rounded-full border border-stone-900/10 bg-white/80 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Admin login
              </Link>
              <Link
                href="/seller/login"
                className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                Seller login
              </Link>
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-12">
          <div className="space-y-8">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-sky-600/15 bg-sky-500/10 px-4 py-1 text-sm font-semibold text-sky-800">
                Marketplace inspired, not a copy
              </span>
              <h2 className="font-display max-w-4xl text-5xl leading-none text-stone-950 sm:text-6xl lg:text-7xl">
                A bigger, sharper homepage built for discovery instead of a generic shop template.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-stone-600">
                The storefront now owns the root route and uses a marketplace-style layout with
                category momentum, promotional storytelling, and separate business portals outside
                the shopping flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {commerceSignals.map((signal) => (
                <article
                  key={signal.label}
                  className="rounded-[1.8rem] border border-stone-900/10 bg-white/78 p-5 shadow-[0_18px_60px_-40px_rgba(28,25,23,0.5)] backdrop-blur"
                >
                  <p className="font-display text-4xl text-stone-950">{signal.value}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{signal.label}</p>
                </article>
              ))}
            </div>

            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-white shadow-[0_30px_100px_-45px_rgba(28,25,23,0.85)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                    Homepage focus
                  </p>
                  <h3 className="font-display mt-3 text-3xl leading-tight sm:text-4xl">
                    Shopper energy on the front. Business control in separate portals.
                  </h3>
                </div>
                <div className="grid gap-2 text-sm text-stone-300">
                  {shopperBlocks.map((block) => (
                    <span
                      key={block}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
                    >
                      {block}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {discoveryLanes.map((lane) => (
              <article
                key={lane.title}
                className="group relative overflow-hidden rounded-[2rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_24px_80px_-40px_rgba(28,25,23,0.45)] backdrop-blur transition hover:-translate-y-1 hover:bg-white"
              >
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${lane.accent} opacity-90 transition group-hover:scale-105`}
                />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                  {lane.eyebrow}
                </p>
                <h3 className="font-display mt-4 text-3xl leading-tight text-stone-950">
                  {lane.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  Designed to feel closer to a modern marketplace landing page, while still keeping
                  the Shopora brand its own.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 pb-8 md:grid-cols-3">
          {brandStories.map((story) => (
            <article
              key={story.title}
              className="rounded-[1.8rem] border border-stone-900/10 bg-white/72 p-6 shadow-[0_20px_60px_-45px_rgba(28,25,23,0.45)] backdrop-blur"
            >
              <p className="font-display text-2xl text-stone-950">{story.title}</p>
              <p className="mt-3 text-sm leading-7 text-stone-600">{story.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
