import Link from "next/link";
import { adminTopbarLinks } from "@/lib/admin-navigation";

type AdminTopbarProps = {
  userName: string;
  isRefreshing: boolean;
  isLoggingOut: boolean;
  onRefresh: () => void;
  onLogout: () => void;
};

export function AdminTopbar({
  userName,
  isRefreshing,
  isLoggingOut,
  onRefresh,
  onLogout,
}: AdminTopbarProps) {
  return (
    <header className="rounded-[2rem] border border-[#ff9900]/15 bg-[#131921] p-5 text-white shadow-[0_24px_80px_-40px_rgba(17,24,39,0.85)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffb84d]">
            Summary API Connected
          </p>
          <h1 className="font-display mt-3 text-3xl sm:text-4xl">
            Admin control desk for {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Black and orange admin styling with live summary cards, connected forms, and catalog
            controls wired to the backend.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {adminTopbarLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full bg-[#ff9900] px-4 py-2 text-sm font-semibold text-[#131921] transition hover:bg-[#ffb84d] disabled:opacity-60"
          >
            {isRefreshing ? "Refreshing..." : "Refresh Summary"}
          </button>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-[#ff9900]/30 px-4 py-2 text-sm font-semibold text-[#ffb84d] transition hover:bg-[#ff9900]/10 disabled:opacity-60"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
