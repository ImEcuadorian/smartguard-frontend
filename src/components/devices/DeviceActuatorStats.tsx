"use client";

import { useMemo, useState } from "react";
import { BellRing, DoorClosed, Lightbulb, Power, RadioTower, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActuatorResponse, ActuatorType, UserRole } from "@/lib/api/types";
import { getActuatorTypeLabel, getStatusLabel } from "@/lib/utils/labels";
import { ActuatorCommandPanel } from "@/components/actuators/ActuatorCommandPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

const icons: Record<ActuatorType, LucideIcon> = {
  BUZZER: BellRing,
  LED: Lightbulb,
  RELAY: Power,
  SERVO: RadioTower,
  SOLENOID_LOCK: DoorClosed,
};

export function DeviceActuatorStats({
  actuators,
  role,
}: {
  actuators: ActuatorResponse[];
  role?: UserRole;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedActuator = useMemo(
    () => actuators.find((actuator) => actuator.id === selectedId) ?? actuators[0] ?? null,
    [actuators, selectedId],
  );

  if (!actuators.length) {
    return (
      <EmptyState
        title="Sin actuadores asociados"
        description="No hay actuadores disponibles para este dispositivo."
      />
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-4 md:grid-cols-2">
        {actuators.map((actuator) => {
          const Icon = icons[actuator.type] ?? SlidersHorizontal;
          const selected = selectedActuator?.id === actuator.id;

          return (
            <button
              key={actuator.id}
              type="button"
              onClick={() => setSelectedId(actuator.id)}
              className={`rounded-lg border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                selected
                  ? "border-[rgb(var(--sg-primary-rgb)/0.42)] bg-[rgb(var(--sg-primary-rgb)/0.12)] shadow-[var(--sg-glow)]"
                  : "border-white/10 bg-slate-950/35 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    {actuator.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {getActuatorTypeLabel(actuator.type)}
                    {actuator.location ? ` - ${actuator.location}` : ""}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[var(--sg-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <StatusBadge status={actuator.status} />
                <span className="text-xs text-slate-500">
                  {getStatusLabel(actuator.status)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <ActuatorCommandPanel actuator={selectedActuator} role={role} />
    </section>
  );
}
