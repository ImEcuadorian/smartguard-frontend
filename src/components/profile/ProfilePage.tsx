"use client";

import { CalendarDays, ShieldCheck, UserCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils/format-date";
import { getHumanRoleLabel, getStatusLabel } from "@/lib/utils/labels";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";

export function ProfilePage() {
  const { session, role } = useAuth();
  const currentUser = useCurrentUser(Boolean(session?.accessToken));

  return (
    <>
      <PageHeader
        title="Mi Perfil"
        description="Informacion de cuenta visible para el cliente SmartGuard."
      />

      {currentUser.isLoading ? <LoadingState label="Cargando perfil" /> : null}
      {currentUser.isError ? (
        <ErrorState
          tone="warning"
          title="Perfil no disponible"
          description="No se pudo consultar el perfil. La sesion sigue protegida por JWT."
        />
      ) : null}

      {currentUser.data ? (
        <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]">
                <UserCircle className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-50">
                {currentUser.data.displayName}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{currentUser.data.username}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge className="border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
                  {getHumanRoleLabel(currentUser.data.role)}
                </Badge>
                <Badge className="border-emerald-300/25 bg-emerald-400/10 text-emerald-100">
                  {getStatusLabel(currentUser.data.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de cuenta</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <InfoItem
                icon={ShieldCheck}
                label="Rol operativo"
                value={getHumanRoleLabel(role)}
              />
              <InfoItem
                icon={CalendarDays}
                label="Cuenta creada"
                value={formatDate(currentUser.data.createdAt)}
              />
              <InfoItem
                icon={CalendarDays}
                label="Ultima actualizacion"
                value={formatDate(currentUser.data.updatedAt)}
              />
              <InfoItem
                icon={UserCircle}
                label="Identificador"
                value={currentUser.data.id}
              />
            </CardContent>
          </Card>
        </section>
      ) : null}
    </>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sg-primary)]" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 break-all text-sm font-medium text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
}
