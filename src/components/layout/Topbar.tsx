"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { getNavigationItems, getRouteTitle } from "./navigation";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const title = getRouteTitle(pathname, role);
  const navigationItems = getNavigationItems(role);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/58 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-normal text-[var(--sg-primary)]">
            SmartGuard
          </p>
          <h1 className="truncate text-lg font-semibold text-slate-100">
            {title}
          </h1>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <Badge className="hidden h-10 items-center gap-2 border-emerald-400/25 bg-emerald-400/10 px-3 text-emerald-100 md:inline-flex">
            <CheckCircle2 className="h-4 w-4" />
            Backend activo
          </Badge>
          <ThemeSwitcher compact className="hidden xl:flex" />
          <UserMenu />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden">
        {navigationItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition duration-300",
                active
                  ? "border-[rgb(var(--sg-primary-rgb)/0.45)] bg-[rgb(var(--sg-primary-rgb)/0.18)] text-[var(--sg-primary)]"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
