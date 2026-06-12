"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export function AccessRestricted({
  title = "Acceso restringido",
  description = "Tu rol actual no tiene permisos para ver esta seccion.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[58vh] items-center justify-center">
      <Card className="w-full max-w-xl overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[rgb(var(--sg-primary-rgb)/0.3)] bg-[rgb(var(--sg-primary-rgb)/0.15)] text-[var(--sg-primary)] shadow-[var(--sg-glow)]">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sg-primary)]">
            SmartGuard access policy
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-50">{title}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            {description}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--sg-primary)] px-4 text-sm font-medium text-slate-950 shadow-[0_0_28px_rgb(var(--sg-primary-rgb)/0.24)] transition duration-300 ease-out hover:brightness-110"
            >
              <ShieldCheck className="h-4 w-4" />
              Volver al dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
