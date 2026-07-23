"use client";

import { useState } from "react";
import { BellRing, LockKeyhole, SlidersHorizontal, Zap } from "lucide-react";
import type { ActuatorResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { getActuatorTypeLabel } from "@/lib/utils/labels";
import { ActuatorCommandPanel } from "@/components/actuators/ActuatorCommandPanel";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { DeviceStatusChart } from "./charts/DeviceStatusChart";
import { MetricCard } from "./MetricCard";
import { QuickControlPanel } from "./QuickControlPanel";
import { StatsOverview } from "./StatsOverview";

export function AdminActuatorsTab({
  stats,
  actuatorsData,
  states,
  role,
}: AdminDashboardTabProps) {
  const [selected, setSelected] = useState<ActuatorResponse | null>(null);
  const selectedActuator = selected ?? actuatorsData[0] ?? null;
  const typeCounts = actuatorsData.reduce(
    (acc, actuator) => {
      acc[actuator.type] = (acc[actuator.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <StatsOverview>
        <MetricCard
          title="Actuadores registrados"
          value={stats.actuators.total}
          description={`${stats.actuators.active} activos`}
          icon={SlidersHorizontal}
          isLoading={states.actuators.isLoading}
          hasError={states.actuators.isError}
        />
        <MetricCard
          title="Buzzer"
          value={typeCounts.BUZZER ?? 0}
          description="Alarmas sonoras"
          icon={BellRing}
          tone="amber"
          isLoading={states.actuators.isLoading}
          hasError={states.actuators.isError}
        />
        <MetricCard
          title="Cerraduras"
          value={typeCounts.SOLENOID_LOCK ?? 0}
          description="Control de acceso fisico"
          icon={LockKeyhole}
          tone="red"
          isLoading={states.actuators.isLoading}
          hasError={states.actuators.isError}
        />
        <MetricCard
          title="LED / rele / servo"
          value={(typeCounts.LED ?? 0) + (typeCounts.RELAY ?? 0) + (typeCounts.SERVO ?? 0)}
          description="Salidas y automatizacion"
          icon={Zap}
          tone="sky"
          isLoading={states.actuators.isLoading}
          hasError={states.actuators.isError}
        />
      </StatsOverview>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ActivityPanel
          title="Tipos de actuador"
          description="Distribucion del modulo de accion fisica."
          icon={SlidersHorizontal}
        >
          <DeviceStatusChart
            title="Actuadores por tipo"
            items={Object.entries(typeCounts).map(([label, value], index) => ({
              label: getActuatorTypeLabel(label),
              value,
              color:
                ["bg-amber-400", "bg-sky-400", "bg-emerald-400", "bg-red-400", "bg-purple-400"][
                  index % 5
                ],
            }))}
          />
        </ActivityPanel>
        <ActivityPanel
          title="Control rapido"
          description="Comandos reales soportados por backend."
          icon={SlidersHorizontal}
        >
          <QuickControlPanel
            actuators={actuatorsData}
            isLoading={states.actuators.isLoading}
            isError={states.actuators.isError}
          />
        </ActivityPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ActivityPanel
          title="Estado visual de actuadores"
          description="Selecciona un actuador para ver historial y comandos."
          icon={SlidersHorizontal}
        >
          {states.actuators.isLoading ? (
            <LoadingState label="Cargando actuadores" />
          ) : states.actuators.isError ? (
            <ErrorState
              tone="warning"
              title="Actuadores no disponibles"
              description="No se pudo consultar el modulo de actuadores."
            />
          ) : actuatorsData.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Actuador</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th>Actualizado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {actuatorsData.slice(0, 10).map((actuator) => (
                  <tr
                    key={actuator.id}
                    className="cursor-pointer transition hover:bg-white/5"
                    onClick={() => setSelected(actuator)}
                  >
                    <Td>
                      <div>
                        <p className="font-medium text-slate-100">{actuator.name}</p>
                        <p className="font-mono text-xs text-slate-500">{actuator.code}</p>
                      </div>
                    </Td>
                    <Td>{getActuatorTypeLabel(actuator.type)}</Td>
                    <Td>
                      <StatusBadge status={actuator.status} />
                    </Td>
                    <Td>{formatDate(actuator.updatedAt ?? actuator.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Sin actuadores"
              description="No hay actuadores registrados para controlar."
            />
          )}
        </ActivityPanel>

        <ActuatorCommandPanel actuator={selectedActuator} role={role} />
      </section>
    </div>
  );
}
