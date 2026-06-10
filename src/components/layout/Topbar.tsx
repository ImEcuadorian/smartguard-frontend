"use client";

import { LogOut, Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/devices": "Dispositivos",
  "/sensors": "Sensores",
  "/access": "RFID / Accesos",
  "/actuators": "Actuadores",
  "/alerts": "Alertas",
  "/settings": "Configuracion",
};

export function Topbar() {
  const pathname = usePathname();
  const { username, role, logout } = useAuth();
  const title =
    titles[pathname] ??
    (pathname.startsWith("/devices") ? "Detalle de dispositivo" : "Detalle de sensor");

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
            <p className="text-xs font-medium uppercase tracking-normal text-[var(--sg-primary)]">
              SmartGuard
            </p>
            <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher compact className="hidden xl:flex" />
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 shadow-lg shadow-black/10 sm:flex">
            <ShieldCheck className="h-4 w-4 text-[var(--sg-primary)]" />
            <div className="leading-tight">
              <div className="text-sm font-medium text-slate-100">
                {username ?? "Usuario"}
              </div>
              {role ? (
                <Badge className="mt-1 border-white/10 bg-white/10 text-slate-200">
                  {role}
                </Badge>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void logout()}
            title="Cerrar sesion"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden">
        {[
          ["Dashboard", "/"],
          ["Dispositivos", "/devices"],
          ["Sensores", "/sensors"],
          ["Accesos", "/access"],
          ["Actuadores", "/actuators"],
          ["Alertas", "/alerts"],
          ["Config.", "/settings"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
