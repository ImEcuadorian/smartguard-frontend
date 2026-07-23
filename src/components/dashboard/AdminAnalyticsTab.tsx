import {
  AlertTriangle,
  BarChart3,
  CircuitBoard,
  Fingerprint,
  RadioReceiver,
  SlidersHorizontal,
} from "lucide-react";
import type { SensorType } from "@/lib/api/types";
import { getActuatorTypeLabel } from "@/lib/utils/labels";
import { getSensorTypeLabel } from "@/lib/utils/sensor-display";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ActivityLog } from "./ActivityLog";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { AlertsChart } from "./charts/AlertsChart";
import { DeviceStatusChart } from "./charts/DeviceStatusChart";
import { RfidEventsChart } from "./charts/RfidEventsChart";
import { SensorReadingsChart } from "./charts/SensorReadingsChart";

const sensorTypeColors = [
  "bg-sky-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-red-400",
  "bg-purple-400",
  "bg-cyan-300",
  "bg-lime-300",
  "bg-fuchsia-300",
];

export function AdminAnalyticsTab({
  stats,
  activityItems,
  chartSensor,
  sensorReadingsData,
  states,
}: AdminDashboardTabProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Actividad general"
          description="Bitacora consolidada para interpretar comportamiento reciente."
          icon={BarChart3}
        >
          <ActivityLog items={activityItems} limit={8} />
        </ActivityPanel>
        <ActivityPanel
          title="Eventos RFID por hora"
          description="Distribucion temporal de accesos permitidos y denegados."
          icon={Fingerprint}
        >
          {states.accessEvents.isLoading ? (
            <LoadingState label="Cargando RFID" />
          ) : states.accessEvents.isError ? (
            <ErrorState tone="info" title="RFID no disponible" />
          ) : (
            <RfidEventsChart events={stats.access.visible} />
          )}
        </ActivityPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Actuadores por tipo"
          description="Distribucion real de buzzer, LED, rele, servo y cerradura."
          icon={SlidersHorizontal}
        >
          <DeviceStatusChart
            title="Tipos de actuador"
            items={Object.entries(stats.actuators.byType).map(([type, value], index) => ({
              label: getActuatorTypeLabel(type),
              value: value ?? 0,
              color:
                ["bg-amber-400", "bg-sky-400", "bg-emerald-400", "bg-red-400", "bg-purple-400"][
                  index % 5
                ],
            }))}
          />
        </ActivityPanel>
        <ActivityPanel
          title="Alertas por estado"
          description="Abiertas, reconocidas y resueltas con datos del backend."
          icon={AlertTriangle}
        >
          <DeviceStatusChart
            title="Estados de alerta"
            items={[
              { label: "Abiertas", value: stats.alerts.open, color: "bg-red-400" },
              { label: "Reconocidas", value: stats.alerts.acknowledged, color: "bg-amber-400" },
              { label: "Resueltas", value: stats.alerts.resolved, color: "bg-emerald-400" },
            ]}
          />
        </ActivityPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Dispositivos por estado"
          description="Distribucion operacional del inventario."
          icon={CircuitBoard}
        >
          <DeviceStatusChart
            title="Estado de dispositivos"
            items={[
              { label: "Activos", value: stats.devices.active, color: "bg-emerald-400" },
              { label: "Inactivos", value: stats.devices.inactive, color: "bg-slate-500" },
              { label: "Mantenimiento", value: stats.devices.maintenance, color: "bg-amber-400" },
            ]}
          />
        </ActivityPanel>
        <ActivityPanel
          title="Sensores por tipo"
          description="Distribucion funcional de telemetria."
          icon={RadioReceiver}
        >
          <DeviceStatusChart
            title="Tipos de sensor"
            items={Object.entries(stats.sensors.byType).map(([type, value], index) => ({
              label: getSensorTypeLabel(type as SensorType),
              value: value ?? 0,
              color: sensorTypeColors[index % sensorTypeColors.length],
            }))}
          />
        </ActivityPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Alertas por severidad"
          description="Riesgo clasificado para el rango actual."
          icon={BarChart3}
        >
          <AlertsChart
            critical={stats.alerts.critical}
            warning={stats.alerts.warning}
            info={stats.alerts.info}
          />
        </ActivityPanel>
        <ActivityPanel
          title="Lecturas recientes por sensor"
          description="Tendencia numerica del sensor activo disponible."
          icon={RadioReceiver}
        >
          {states.sensorReadings.isLoading ? (
            <LoadingState label="Cargando lecturas" />
          ) : states.sensorReadings.isError ? (
            <ErrorState tone="info" title="Lecturas no disponibles" />
          ) : (
            <SensorReadingsChart
              sensor={chartSensor}
              readings={sensorReadingsData}
            />
          )}
        </ActivityPanel>
      </section>
    </div>
  );
}
