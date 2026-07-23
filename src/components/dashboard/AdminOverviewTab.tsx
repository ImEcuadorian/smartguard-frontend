import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Fingerprint,
  RadioReceiver,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  Wrench,
  XCircle,
} from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { DonutStat } from "./DonutStat";
import { MetricCard } from "./MetricCard";
import { StatsOverview } from "./StatsOverview";
import { SystemHealthCard } from "./SystemHealthCard";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";

export function AdminOverviewTab({
  stats,
  modules,
  states,
  isAdmin,
}: AdminDashboardTabProps) {
  const coreError =
    states.devices.isError || states.sensors.isError || states.alerts.isError;

  return (
    <div className="space-y-6">
      {coreError ? (
        <ErrorState
          tone="warning"
          title="Algunos modulos no respondieron"
          description="El resumen global muestra la informacion disponible sin bloquear las demas secciones."
        />
      ) : null}

      <StatsOverview>
        <MetricCard
          title="Dispositivos totales"
          value={stats.devices.total}
          description={`${stats.devices.active} activos en linea`}
          icon={CircuitBoard}
          isLoading={states.devices.isLoading}
          hasError={states.devices.isError}
        />
        <MetricCard
          title="Dispositivos activos"
          value={stats.devices.active}
          description="ESP32 operativos"
          icon={CheckCircle2}
          tone="emerald"
          isLoading={states.devices.isLoading}
          hasError={states.devices.isError}
        />
        <MetricCard
          title="Dispositivos inactivos"
          value={stats.devices.inactive}
          description="Sin actividad operativa"
          icon={XCircle}
          tone="slate"
          isLoading={states.devices.isLoading}
          hasError={states.devices.isError}
        />
        <MetricCard
          title="En mantenimiento"
          value={stats.devices.maintenance}
          description="Equipos fuera de servicio"
          icon={Wrench}
          tone="amber"
          isLoading={states.devices.isLoading}
          hasError={states.devices.isError}
        />
        <MetricCard
          title="Sensores totales"
          value={stats.sensors.total}
          description={`${stats.sensors.active} sensores activos`}
          icon={RadioReceiver}
          tone="sky"
          isLoading={states.sensors.isLoading}
          hasError={states.sensors.isError}
        />
        <MetricCard
          title="Alertas abiertas"
          value={stats.alerts.open}
          description={`${stats.alerts.critical} criticas`}
          icon={AlertTriangle}
          tone={stats.alerts.critical > 0 ? "red" : "emerald"}
          isLoading={states.alerts.isLoading}
          hasError={states.alerts.isError}
        />
        <MetricCard
          title="Actuadores"
          value={stats.actuators.total}
          description={`${stats.actuators.active} disponibles`}
          icon={SlidersHorizontal}
          tone="amber"
          isLoading={states.actuators.isLoading}
          hasError={states.actuators.isError}
        />
        <MetricCard
          title={isAdmin ? "Clientes / usuarios" : "Modo operador"}
          value={isAdmin ? stats.users.total : "Limitado"}
          description={isAdmin ? `${stats.users.active} cuentas activas` : "Sin administracion de usuarios"}
          icon={UsersRound}
          tone="slate"
          isLoading={isAdmin ? states.users.isLoading : false}
          hasError={isAdmin ? states.users.isError : false}
        />
      </StatsOverview>

      <section className="grid gap-6 xl:grid-cols-4">
        <DonutStat
          title="Estado general"
          value={stats.systemScore}
          total={100}
          label="Salud operativa calculada"
          icon={ShieldCheck}
        />
        <DonutStat
          title="Dispositivos activos"
          value={stats.devices.active}
          total={stats.devices.total}
          label="ESP32 activos"
          icon={Cpu}
        />
        <DonutStat
          title="Sensores activos"
          value={stats.sensors.active}
          total={stats.sensors.total}
          label="Telemetria disponible"
          icon={RadioReceiver}
          tone="rgb(56 189 248)"
        />
        <DonutStat
          title="Accesos concedidos"
          value={stats.access.granted}
          total={Math.max(stats.access.total, stats.access.granted)}
          label="RFID en el rango"
          icon={Fingerprint}
          tone="rgb(52 211 153)"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SystemHealthCard modules={modules} />
        <StatsOverview>
          <MetricCard
            title="Alertas criticas"
            value={stats.alerts.critical}
            description="Riesgo de alta prioridad"
            icon={Bell}
            tone={stats.alerts.critical > 0 ? "red" : "slate"}
            isLoading={states.alerts.isLoading}
            hasError={states.alerts.isError}
          />
          <MetricCard
            title="Eventos RFID"
            value={stats.access.total}
            description={`${stats.access.denied} denegados`}
            icon={Fingerprint}
            tone="primary"
            isLoading={states.accessEvents.isLoading}
            hasError={states.accessEvents.isError}
          />
          <MetricCard
            title="Sensores inactivos"
            value={stats.sensors.inactive}
            description={`${stats.sensors.maintenance} en mantenimiento`}
            icon={RadioReceiver}
            tone="slate"
            isLoading={states.sensors.isLoading}
            hasError={states.sensors.isError}
          />
          <MetricCard
            title="Alertas resueltas"
            value={stats.alerts.resolved}
            description={`${stats.alerts.acknowledged} reconocidas`}
            icon={CheckCircle2}
            tone="emerald"
            isLoading={states.alerts.isLoading}
            hasError={states.alerts.isError}
          />
        </StatsOverview>
      </section>
    </div>
  );
}
