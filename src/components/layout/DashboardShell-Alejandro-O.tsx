"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useRequireAuth } from "@/lib/auth/require-auth";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageTransition } from "@/components/ui/PageTransition";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { isChecking, isAuthorized } = useRequireAuth();
  const pathname = usePathname();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <GradientBackground />
        <LoadingState label="Verificando sesion" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <GradientBackground />
        <LoadingState label="Redirigiendo al login" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <GradientBackground />
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-full w-full max-w-[1760px] flex-col">
              <PageTransition key={pathname}>{children}</PageTransition>
              <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>SmartGuard IoT Security Console</span>
                <span>ESP32 / RFID / Sensors / Alerts</span>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
