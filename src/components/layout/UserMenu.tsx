"use client";

import {
  ChevronDown,
  LogOut,
  Palette,
  Settings,
  UserCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils/cn";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Badge } from "@/components/ui/Badge";

export function UserMenu() {
  const { username, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = String(username ?? "U").slice(0, 1).toUpperCase();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-2.5 text-left shadow-lg shadow-black/10 transition duration-300 hover:border-white/20 hover:bg-white/12",
          open ? "border-[rgb(var(--sg-primary-rgb)/0.45)] bg-white/12" : null,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgb(var(--sg-primary-rgb)/0.16)] text-sm font-semibold text-[var(--sg-primary)]">
          {initial}
        </span>
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block max-w-28 truncate text-sm font-medium text-slate-100">
            {username ?? "Usuario"}
          </span>
          <span className="mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {getRoleLabel(role)}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-slate-400 transition sm:block",
            open ? "rotate-180" : null,
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),20rem)] origin-top-right animate-sg-fade-up overflow-hidden rounded-lg border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--sg-primary)] text-base font-semibold text-slate-950 shadow-[var(--sg-glow)]">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-50">
                  {username ?? "Usuario"}
                </p>
                <Badge className="mt-1 border-white/10 bg-white/10 text-slate-200">
                  {getRoleLabel(role)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-2">
            <MenuLink href="/settings" icon={UserCircle} onClick={() => setOpen(false)}>
              Ver perfil
            </MenuLink>
            <MenuLink href="/settings" icon={Settings} onClick={() => setOpen(false)}>
              Configuracion
            </MenuLink>
            <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <Palette className="h-3.5 w-3.5 text-[var(--sg-primary)]" />
                Cambiar tema
              </div>
              <ThemeSwitcher compact className="w-full" />
            </div>
          </div>

          <div className="border-t border-white/10 p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void logout();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-500/10"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
      role="menuitem"
    >
      <Icon className="h-4 w-4 text-slate-400" />
      {children}
    </Link>
  );
}
