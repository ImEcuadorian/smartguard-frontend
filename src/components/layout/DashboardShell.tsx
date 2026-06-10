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
            <PageTransition key={pathname}>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
