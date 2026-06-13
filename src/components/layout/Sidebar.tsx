"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import {
  BrandIcon,
  getNavigationItems,
  getSectionLabel,
  type NavigationItem,
} from "./navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const navigationItems = getNavigationItems(role);
  const sections = navigationItems.reduce<Record<string, NavigationItem[]>>(
    (accumulator, item) => {
      accumulator[item.section] ??= [];
      accumulator[item.section].push(item);
      return accumulator;
    },
    {},
  );
  const sectionOrder = ["main", "admin", "account"];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/70 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]">
          <BrandIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-normal">SmartGuard</div>
          <div className="text-xs text-slate-400">IoT Security Console</div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 px-3 py-5">
        {sectionOrder.map((section) => {
          const items = sections[section] ?? [];
          if (!items.length) return null;

          return (
            <div key={section}>
              <div className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {getSectionLabel(section as NavigationItem["section"])}
              </div>
              <div className="space-y-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition duration-300 ease-out",
                        active
                          ? "bg-[rgb(var(--sg-primary-rgb)/0.92)] text-slate-950 shadow-[var(--sg-glow)]"
                          : "text-slate-300 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
                      ) : null}
                      <Icon className="h-4 w-4 shrink-0 transition duration-300 group-hover:scale-110" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
        <div className="flex items-center justify-between gap-3">
          <span>Rol activo</span>
          <Badge className="border-white/10 bg-white/10 text-slate-200">
            {getRoleLabel(role)}
          </Badge>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-[var(--sg-primary)] shadow-[var(--sg-glow)]" />
        </div>
      </div>
    </aside>
  );
}
