import { Fingerprint, LockKeyhole, ShieldCheck, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { RfidEventsChart } from "./charts/RfidEventsChart";
import { DonutStat } from "./DonutStat";
import { MetricCard } from "./MetricCard";
import { RecentAccessEvents } from "./RecentAccessEvents";
import { StatsOverview } from "./StatsOverview";

export function AdminRfidTab({
  stats,
  accessReadersData,
  states,
}: AdminDashboardTabProps) {
  const grantedPercent = stats.access.total
    ? Math.round((stats.access.granted / stats.access.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <StatsOverview>
        <MetricCard
          title="Eventos RFID"
          value={stats.access.total}
          description="Eventos en el rango"
          icon={Fingerprint}
          isLoading={states.accessEvents.isLoading}
          hasError={states.accessEvents.isError}
        />
        <MetricCard
          title="Accesos concedidos"
          value={stats.access.granted}
          description={`${grantedPercent}% permitidos`}
          icon={ShieldCheck}
          tone="emerald"
          isLoading={states.accessEvents.isLoading}
          hasError={states.accessEvents.isError}
        />
        <MetricCard
          title="Accesos denegados"
          value={stats.access.denied}
          description="Intentos rechazados"
          icon={XCircle}
          tone={stats.access.denied > 0 ? "red" : "slate"}
          isLoading={states.accessEvents.isLoading}
          hasError={states.accessEvents.isError}
        />
        <MetricCard
          title="Lectores registrados"
          value={accessReadersData.length}
          description="RFID / NFC disponibles"
          icon={LockKeyhole}
          tone="amber"
          isLoading={states.accessReaders.isLoading}
          hasError={states.accessReaders.isError}
        />
      </StatsOverview>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <DonutStat
          title="Accesos permitidos"
          value={stats.access.granted}
          total={Math.max(stats.access.total, stats.access.granted)}
          label="RFID autorizados"
          icon={ShieldCheck}
          tone="rgb(52 211 153)"
        />
        <ActivityPanel
          title="Accesos concedidos vs denegados"
          description="Actividad por hora en el rango seleccionado."
          icon={Fingerprint}
        >
          {states.accessEvents.isLoading ? (
            <LoadingState label="Cargando RFID" />
          ) : states.accessEvents.isError ? (
            <ErrorState
              tone="info"
              title="RFID no disponible"
              description="El modulo RFID puede estar limitado por permisos del backend."
            />
          ) : (
            <RfidEventsChart events={stats.access.visible} />
          )}
        </ActivityPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ActivityPanel
          title="Ultimos eventos RFID"
          description="Tarjetas permitidas y rechazadas."
          icon={Fingerprint}
        >
          {states.accessEvents.isLoading ? (
            <LoadingState label="Cargando eventos RFID" />
          ) : states.accessEvents.isError ? (
            <ErrorState tone="info" title="Eventos RFID no disponibles" />
          ) : (
            <RecentAccessEvents events={stats.access.visible} />
          )}
        </ActivityPanel>

        <ActivityPanel
          title="Lectores registrados"
          description="Dispositivos de lectura disponibles."
          icon={LockKeyhole}
        >
          {states.accessReaders.isLoading ? (
            <LoadingState label="Cargando lectores" />
          ) : states.accessReaders.isError ? (
            <ErrorState
              tone="info"
              title="Lectores no disponibles"
              description="No se pudo consultar lectores RFID."
            />
          ) : accessReadersData.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Codigo</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th>Actualizado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {accessReadersData.slice(0, 8).map((reader) => (
                  <tr key={reader.id}>
                    <Td className="font-mono text-xs">{reader.code}</Td>
                    <Td>{reader.type}</Td>
                    <Td>
                      <StatusBadge status={reader.status} />
                    </Td>
                    <Td>{formatDate(reader.updatedAt ?? reader.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Sin lectores RFID"
              description="No hay lectores registrados o el backend no devolvio datos."
            />
          )}
        </ActivityPanel>
      </section>
    </div>
  );
}
