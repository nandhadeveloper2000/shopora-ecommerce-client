import type { AdminDashboardSummary } from "@/types";

type AdminDashboardMenuProps = {
  summary: AdminDashboardSummary;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Recently updated";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently updated"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export function AdminDashboardMenu({ summary }: AdminDashboardMenuProps) {
  const overviewCards = [
    {
      label: "Categories",
      value: summary.overview.categories,
      tone: "text-[#ff9900]",
    },
    {
      label: "Brands",
      value: summary.overview.brands,
      tone: "text-[#ffb84d]",
    },
    {
      label: "Subcategories",
      value: summary.overview.subcategories,
      tone: "text-[#ffd28a]",
    },
    {
      label: "Models",
      value: summary.overview.models,
      tone: "text-white",
    },
  ];

  const sellerCards = [
    {
      label: "Pending Seller Approvals",
      value: summary.overview.pendingSellerApprovals,
    },
    {
      label: "Approved Sellers",
      value: summary.overview.approvedSellers,
    },
    {
      label: "Total Sellers",
      value: summary.overview.totalSellers,
    },
    {
      label: "Total Customers",
      value: summary.overview.totalCustomers,
    },
  ];

  const maxSellerStatusCount = Math.max(
    ...summary.sellerStatusBreakdown.map((item) => item.count),
    1
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.75rem] border border-[#ff9900]/12 bg-[#131921] p-5 text-white shadow-[0_20px_70px_-42px_rgba(17,24,39,0.8)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {card.label}
            </p>
            <p className={`font-display mt-3 text-4xl ${card.tone}`}>{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <article
            id="summary-board"
            className="scroll-mt-6 rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-6 shadow-[0_20px_70px_-45px_rgba(17,24,39,0.28)]"
          >
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Dashboard Summary
              </p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">
                Summary API content
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sellerCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="font-display mt-3 text-4xl text-slate-950">{card.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-6 shadow-[0_20px_70px_-45px_rgba(17,24,39,0.28)]">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Seller Status
              </p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">
                Approval queue and onboarding stages
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {summary.sellerStatusBreakdown.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{item.status.replaceAll("_", " ")}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-[#ff9900]"
                      style={{
                        width: `${(item.count / maxSellerStatusCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article
            id="seller-queue"
            className="scroll-mt-6 rounded-[2rem] border border-[#ff9900]/12 bg-[#232f3e] p-6 text-white shadow-[0_20px_70px_-45px_rgba(17,24,39,0.78)]"
          >
            <div className="border-b border-white/10 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb84d]">
                Recent Sellers
              </p>
              <h2 className="font-display mt-3 text-3xl">Fresh activity in the queue</h2>
            </div>

            <div className="mt-5 space-y-3">
              {summary.recentSellers.map((seller) => (
                <div
                  key={seller._id}
                  className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{seller.shopName || "Unnamed shop"}</p>
                      <p className="mt-1 text-sm text-slate-300">{seller.businessEmail}</p>
                    </div>
                    <span className="rounded-full bg-[#ff9900]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb84d]">
                      {seller.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Profile completion {seller.profileCompletion}%</span>
                    <span>{formatDate(seller.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article
            id="recent-activity"
            className="scroll-mt-6 rounded-[2rem] border border-[#ff9900]/12 bg-white/88 p-6 shadow-[0_20px_70px_-45px_rgba(17,24,39,0.28)]"
          >
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Recent Catalog
              </p>
              <h2 className="font-display mt-3 text-3xl text-slate-950">
                Latest connected entities
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Categories</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {summary.recentCatalog.categories.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Brands</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {summary.recentCatalog.brands.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Subcategories</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {summary.recentCatalog.subcategories.map((item) => (
                    <div key={item._id} className="space-y-1">
                      <p>{item.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Models</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {summary.recentCatalog.models.map((item) => (
                    <div key={item._id} className="space-y-1">
                      <p>{item.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
