"use client";

import { Menu, ServerCog, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils/cn";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "./UserMenu";
import { getNavigationItems, getRouteTitle } from "./navigation";

export function Topbar() {
  const pathname = usePathname();
  const { role, session } = useAuth();
  const currentUser = useCurrentUser(Boolean(session?.accessToken));
  const title = getRouteTitle(pathname, role);
  const navigation = getNavigationItems(role);
  const backendState = currentUser.isLoading
    ? "Verificando"
    : currentUser.isError
      ? "Backend limitado"
      : "Backend activo";
  const BackendIcon = currentUser.isError ? WifiOff : currentUser.isLoading ? ServerCog : Wifi;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/72 backdrop-blur-2xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Menu"
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--sg-primary)]">
              SmartGuard
            </p>
            <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "hidden h-10 items-center gap-2 rounded-lg border px-3 text-xs font-medium md:flex",
              currentUser.isError
                ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
                : "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
            )}
            title="Estado de conexion con el backend"
          >
            <BackendIcon className="h-4 w-4" />
            {backendState}
          </div>
          <ThemeSwitcher
            compact
            className="hidden xl:flex [&>div:first-child]:h-10 [&>div:first-child]:w-10 [&>div:last-child]:w-44"
          />
          <UserMenu />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "border-[rgb(var(--sg-primary-rgb)/0.45)] bg-[rgb(var(--sg-primary-rgb)/0.18)] text-[var(--sg-primary)]"
                  : "border-white/10 bg-white/5 text-slate-300",
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
