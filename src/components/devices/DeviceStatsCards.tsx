import type { ReactNode } from "react";
import {
  AlertTriangle,
  Cpu,
  RadioReceiver,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ActuatorResponse,
  AlertResponse,
  DeviceResponse,
  SensorResponse,
} from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function DeviceStatsCards({
  device,
  sensors,
  actuators,
  alerts,
}: {
  device: DeviceResponse;
  sensors: SensorResponse[];
  actuators: ActuatorResponse[];
  alerts: AlertResponse[];
}) {
  const activeSensors = sensors.filter((sensor) => sensor.status === "ACTIVE").length;
  const inactiveSensors = sensors.filter((sensor) => sensor.status !== "ACTIVE").length;
  const activeActuators = actuators.filter(
    (actuator) => actuator.status === "ACTIVE",
  ).length;
  const openAlerts = alerts.filter((alert) => alert.status === "OPEN").length;
  const healthScore = Math.max(
    0,
    Math.round(
      ((device.status === "ACTIVE" ? 0.45 : 0) +
        (sensors.length ? (activeSensors / sensors.length) * 0.35 : 0.25) +
        (actuators.length ? (activeActuators / actuators.length) * 0.2 : 0.15) -
        Math.min(0.4, openAlerts * 0.1)) *
        100,
    ),
  );

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Salud del dispositivo"
        value={`${healthScore}%`}
        description={device.status === "ACTIVE" ? "Operativo" : "Requiere revision"}
        icon={ShieldCheck}
        critical={openAlerts > 0 || device.status !== "ACTIVE"}
      />
      <StatCard
        title="Sensores conectados"
        value={sensors.length}
        description={`${activeSensors} activos, ${inactiveSensors} inactivos`}
        icon={RadioReceiver}
      />
      <StatCard
        title="Actuadores conectados"
        value={actuators.length}
        description={`${activeActuators} activos`}
        icon={SlidersHorizontal}
      />
      <StatCard
        title="Alertas relacionadas"
        value={openAlerts}
        description={`${alerts.length} eventos historicos visibles`}
        icon={AlertTriangle}
        critical={openAlerts > 0}
      />
      <Card className="md:col-span-2 xl:col-span-4">
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Info label="Estado" value={<StatusBadge status={device.status} />} />
          <Info label="IP" value={device.ipAddress ?? "Sin IP"} icon={Wifi} />
          <Info label="Firmware" value={device.firmwareVersion ?? "Sin version"} icon={Cpu} />
          <Info label="Ultima conexion" value={formatDate(device.lastSeenAt)} />
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  critical,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  critical?: boolean;
}) {
  return (
    <Card className={critical ? "sg-critical-card" : undefined}>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {title}
            </p>
            <p className="animate-metric-count mt-3 text-3xl font-semibold text-slate-50">
              {value}
            </p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg ${
              critical
                ? "bg-red-500/15 text-red-200"
                : "bg-[rgb(var(--sg-primary-rgb)/0.16)] text-[var(--sg-primary)]"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="flex items-start gap-3">
        {Icon ? <Icon className="mt-0.5 h-4 w-4 text-[var(--sg-primary)]" /> : null}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <div className="mt-2 break-all text-sm font-medium text-slate-100">{value}</div>
        </div>
      </div>
    </div>
  );
}
