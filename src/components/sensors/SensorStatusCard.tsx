"use client";

import {
  AlertTriangle,
  DoorOpen,
  Flame,
  Lightbulb,
  Move,
  RadioReceiver,
  Ruler,
  Thermometer,
  Waves,
} from "lucide-react";
import type { SensorResponse } from "@/lib/api/types";
import { useLatestSensorReading } from "@/hooks/useSensors";
import type { SensorDisplayIcon } from "@/lib/utils/sensor-display";
import { getSensorDisplay, getSensorTypeLabel } from "@/lib/utils/sensor-display";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { SensorReadingValue } from "./SensorReadingValue";

const icons = {
  door: DoorOpen,
  motion: Move,
  gas: Flame,
  temperature: Thermometer,
  humidity: Waves,
  light: Lightbulb,
  distance: Ruler,
  emergency: AlertTriangle,
  sensor: RadioReceiver,
} satisfies Record<SensorDisplayIcon, typeof RadioReceiver>;

const toneClasses = {
  primary: "border-[rgb(var(--sg-primary-rgb)/0.24)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]",
  emerald: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  red: "border-red-300/25 bg-red-500/10 text-red-100",
  sky: "border-sky-300/25 bg-sky-400/10 text-sky-100",
  slate: "border-white/10 bg-white/8 text-slate-200",
};

export function SensorStatusCard({
  sensor,
  refetchInterval,
}: {
  sensor: SensorResponse;
  refetchInterval?: number;
}) {
  const latestReading = useLatestSensorReading(sensor.id, { refetchInterval });
  const display = getSensorDisplay(sensor, latestReading.data);
  const Icon = icons[display.icon];

  return (
    <article
      className={cn(
        "sg-card-lift rounded-lg border border-white/10 bg-slate-950/35 p-4",
        display.isCritical ? "sg-critical-card" : null,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{sensor.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {display.title || getSensorTypeLabel(sensor.type)}
            {sensor.location ? ` - ${sensor.location}` : ""}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
            toneClasses[display.tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {latestReading.isLoading ? (
          <p className="text-sm text-slate-500">Leyendo telemetria...</p>
        ) : (
          <SensorReadingValue display={display} />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <Badge className={cn("sg-status-badge", toneClasses[display.tone])}>
          {display.isCritical ? "Atencion" : "Operativo"}
        </Badge>
        <span className="text-xs text-slate-500">
          {formatDate(latestReading.data?.recordedAt ?? sensor.lastReadingAt)}
        </span>
      </div>
    </article>
  );
}
