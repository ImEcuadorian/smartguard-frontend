import {
  AlertTriangle,
  DoorOpen,
  Droplets,
  Flame,
  Move,
  ShieldCheck,
  Thermometer,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type KitchenTone = "stable" | "warning" | "critical";

interface KitchenStatus {
  tone: KitchenTone;
  label: string;
  description: string;
  score: number;
  gasRisk: boolean;
  temperatureRisk: boolean;
  humidityRisk: boolean;
  doorOpen: boolean;
  motionDetected: boolean;
  emergency: boolean;
}

const toneStyles: Record<KitchenTone, string> = {
  stable: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  warning: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  critical: "border-red-300/25 bg-red-500/10 text-red-100",
};

export function KitchenStatusPanel({
  kitchen,
}: {
  kitchen: KitchenStatus;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden",
        kitchen.tone === "critical" ? "sg-critical-card" : "sg-glow-breathe",
      )}
    >
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Estado operativo de cocina</CardTitle>
          <p className="mt-1 text-sm text-slate-400">
            Riesgos calculados con alertas y sensores reales disponibles.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
            toneStyles[kitchen.tone],
          )}
        >
          <Utensils className="h-3.5 w-3.5" />
          {kitchen.label}
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-5xl font-semibold text-slate-50">
              {kitchen.score}%
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {kitchen.description}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  "h-full origin-left rounded-full shadow-[var(--sg-glow)] animate-progress-grow",
                  kitchen.tone === "critical"
                    ? "bg-red-400"
                    : kitchen.tone === "warning"
                      ? "bg-amber-300"
                      : "bg-[var(--sg-primary)]",
                )}
                style={{ width: `${kitchen.score}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <KitchenSignal
              icon={Flame}
              title="Gas / humo"
              active={kitchen.gasRisk}
              activeText="Riesgo detectado"
              idleText="Normal"
              danger
            />
            <KitchenSignal
              icon={Thermometer}
              title="Temperatura"
              active={kitchen.temperatureRisk}
              activeText="Fuera de rango"
              idleText="Estable"
            />
            <KitchenSignal
              icon={Droplets}
              title="Humedad"
              active={kitchen.humidityRisk}
              activeText="Revision"
              idleText="Normal"
            />
            <KitchenSignal
              icon={DoorOpen}
              title="Puertas"
              active={kitchen.doorOpen}
              activeText="Abierta"
              idleText="Cerradas"
            />
            <KitchenSignal
              icon={Move}
              title="Movimiento"
              active={kitchen.motionDetected}
              activeText="Detectado"
              idleText="Sin movimiento"
            />
            <KitchenSignal
              icon={AlertTriangle}
              title="Emergencia"
              active={kitchen.emergency}
              activeText="Activada"
              idleText="Normal"
              danger
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KitchenSignal({
  icon: Icon,
  title,
  active,
  activeText,
  idleText,
  danger,
}: {
  icon: LucideIcon;
  title: string;
  active: boolean;
  activeText: string;
  idleText: string;
  danger?: boolean;
}) {
  const tone = active
    ? danger
      ? "border-red-300/25 bg-red-500/10 text-red-100"
      : "border-amber-300/25 bg-amber-400/10 text-amber-100"
    : "border-emerald-300/20 bg-emerald-400/8 text-emerald-100";

  return (
    <div className={cn("rounded-lg border p-4", tone)}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-current/10">
          {active ? <Icon className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs opacity-75">
            {active ? activeText : idleText}
          </p>
        </div>
      </div>
    </div>
  );
}
