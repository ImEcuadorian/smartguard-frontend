import Link from "next/link";
import { ShieldCheck, UserCheck, UserX, UsersRound } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";
import { getHumanRoleLabel } from "@/lib/utils/labels";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { MetricCard } from "./MetricCard";
import { StatsOverview } from "./StatsOverview";

export function AdminUsersTab({
  stats,
  usersData,
  states,
  isAdmin,
}: AdminDashboardTabProps) {
  if (!isAdmin) {
    return (
      <ErrorState
        tone="info"
        title="Administracion no disponible para operador"
        description="El rol OPERATOR mantiene funciones operativas, pero no accede a gestion de usuarios."
      />
    );
  }

  return (
    <div className="space-y-6">
      <StatsOverview>
        <MetricCard
          title="Usuarios totales"
          value={stats.users.total}
          description="Cuentas registradas"
          icon={UsersRound}
          isLoading={states.users.isLoading}
          hasError={states.users.isError}
        />
        <MetricCard
          title="Clientes"
          value={stats.users.viewers}
          description="VIEWER mostrado como CLIENTE"
          icon={UserCheck}
          tone="emerald"
          isLoading={states.users.isLoading}
          hasError={states.users.isError}
        />
        <MetricCard
          title="Admins / operadores"
          value={stats.users.admins + stats.users.operators}
          description={`${stats.users.admins} admin, ${stats.users.operators} operadores`}
          icon={ShieldCheck}
          tone="amber"
          isLoading={states.users.isLoading}
          hasError={states.users.isError}
        />
        <MetricCard
          title="Deshabilitados"
          value={stats.users.disabled}
          description="Usuarios sin acceso"
          icon={UserX}
          tone={stats.users.disabled > 0 ? "red" : "slate"}
          isLoading={states.users.isLoading}
          hasError={states.users.isError}
        />
      </StatsOverview>

      <ActivityPanel
        title="Tabla compacta de usuarios"
        description="Resumen administrativo con acceso directo a gestion completa."
        icon={UsersRound}
      >
        <div className="mb-4 flex justify-end">
          <Link
            href="/users"
            className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-sm font-medium text-slate-100 transition duration-300 hover:border-white/20 hover:bg-white/15"
          >
            Abrir gestion de usuarios
          </Link>
        </div>
        {states.users.isLoading ? (
          <LoadingState label="Cargando usuarios" />
        ) : states.users.isError ? (
          <ErrorState
            tone="warning"
            title="Usuarios no disponibles"
            description="No se pudo consultar el modulo de usuarios."
          />
        ) : usersData.length ? (
          <DataTable>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Creado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {usersData.slice(0, 12).map((user) => (
                <tr key={user.id}>
                  <Td>
                    <div>
                      <p className="font-medium text-slate-100">{user.displayName}</p>
                      <p className="text-xs text-slate-500">{user.username}</p>
                    </div>
                  </Td>
                  <Td>{getHumanRoleLabel(user.role)}</Td>
                  <Td>
                    <StatusBadge status={user.status} />
                  </Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        ) : (
          <EmptyState
            title="Sin usuarios"
            description="No hay cuentas registradas para listar."
          />
        )}
      </ActivityPanel>
    </div>
  );
}
