"use client";

import { CalendarDays, ShieldCheck, Store, UserCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils/format-date";
import { getHumanRoleLabel, getStatusLabel } from "@/lib/utils/labels";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfileForm } from "./ProfileForm";

export function ProfilePage() {
  const { session, role, logout } = useAuth();
  const currentUser = useCurrentUser(Boolean(session?.accessToken));

  return (
    <>
      <PageHeader
        title="Mi perfil"
        description="Actualiza tu informacion personal de SmartGuard 360."
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
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[var(--sg-primary)] text-slate-950 shadow-[var(--sg-glow)]">
                <UserCircle className="h-10 w-10" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
                    {getHumanRoleLabel(currentUser.data.role)}
                  </Badge>
                  <Badge className="border-emerald-300/25 bg-emerald-400/10 text-emerald-100">
                    {getStatusLabel(currentUser.data.status)}
                  </Badge>
                </div>
                <h2 className="mt-3 truncate text-2xl font-semibold text-slate-50">
                  {currentUser.data.displayName}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {currentUser.data.username}
                </p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <SummaryItem
                    icon={ShieldCheck}
                    label="Tipo de cuenta"
                    value={getHumanRoleLabel(role)}
                  />
                  <SummaryItem
                    icon={CalendarDays}
                    label="Cuenta creada"
                    value={formatDate(currentUser.data.createdAt)}
                  />
                  <SummaryItem
                    icon={Store}
                    label="Restaurante"
                    value="Perfil visual preparado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ProfileForm
            user={currentUser.data}
            onLogout={() => {
              void logout();
            }}
          />
        </div>
      ) : null}
    </>
  );
}

function SummaryItem({
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
