import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  RadioReceiver,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ActuatorResponse,
  AlertResponse,
  DeviceResponse,
  SensorResponse,
} from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { getStatusLabel } from "@/lib/utils/labels";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function DeviceStatsPanel({
  devices,
  sensors,
  actuators,
  alerts,
  limit = 6,
  clientMode = false,
}: {
  devices: DeviceResponse[];
  sensors: SensorResponse[];
  actuators: ActuatorResponse[];
  alerts: AlertResponse[];
  limit?: number;
  clientMode?: boolean;
}) {
  const visibleDevices = devices.slice(0, limit);

  if (!visibleDevices.length) {
    return (
      <EmptyState
        title="No hay dispositivos registrados todavia"
        description="Cuando existan dispositivos ESP32, sus estadisticas apareceran aqui."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {visibleDevices.map((device) => {
        const deviceSensors = sensors.filter((sensor) => sensor.deviceId === device.id);
        const deviceActuators = actuators.filter(
          (actuator) => actuator.deviceId === device.id,
        );
        const deviceAlerts = alerts.filter((alert) => alert.deviceId === device.id);
        const activeSensors = deviceSensors.filter(
          (sensor) => sensor.status === "ACTIVE",
        ).length;
        const activeActuators = deviceActuators.filter(
          (actuator) => actuator.status === "ACTIVE",
        ).length;
        const criticalAlerts = deviceAlerts.filter(
          (alert) => alert.status === "OPEN" && alert.severity === "CRITICAL",
        ).length;
        const healthScore = Math.max(
          0,
          Math.round(
            ((device.status === "ACTIVE" ? 0.45 : 0) +
              (deviceSensors.length ? (activeSensors / deviceSensors.length) * 0.35 : 0.25) +
              (deviceActuators.length
                ? (activeActuators / deviceActuators.length) * 0.2
                : 0.15) -
              Math.min(0.35, criticalAlerts * 0.12)) *
              100,
          ),
        );

        return (
          <Card
            key={device.id}
            className={criticalAlerts > 0 ? "sg-critical-card" : undefined}
          >
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-50">
                    {device.name}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">
                    {clientMode ? device.location ?? "Ubicacion no registrada" : device.code}
                  </p>
                </div>
                <StatusBadge status={device.status} />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniStat
                  icon={RadioReceiver}
                  label="Sensores"
                  value={`${activeSensors}/${deviceSensors.length}`}
                />
                <MiniStat
                  icon={SlidersHorizontal}
                  label="Actuadores"
                  value={`${activeActuators}/${deviceActuators.length}`}
                />
                <MiniStat
                  icon={Bell}
                  label="Alertas"
                  value={criticalAlerts ? String(criticalAlerts) : "0"}
                  critical={criticalAlerts > 0}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Salud
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50">
                    {healthScore}%
                  </p>
                </div>
                <div className="h-2 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-full origin-left animate-progress-grow rounded-full bg-[var(--sg-primary)] shadow-[var(--sg-glow)] transition-all duration-700"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500">
                <span>{getStatusLabel(device.status)}</span>
                <span>{formatDate(device.lastSeenAt)}</span>
              </div>

              <Link
                href={`/devices/${device.id}`}
                className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 text-sm font-medium text-slate-100 transition hover:border-[rgb(var(--sg-primary-rgb)/0.3)] hover:bg-white/15"
              >
                Ver detalle
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  critical,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  critical?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        critical
          ? "border-red-300/25 bg-red-500/10 text-red-100"
          : "border-white/10 bg-slate-950/35 text-slate-200"
      }`}
    >
      <Icon className="h-4 w-4 text-[var(--sg-primary)]" />
      <p className="mt-2 text-lg font-semibold text-slate-50">{value}</p>
      <p className="mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
    </div>
  );
}
