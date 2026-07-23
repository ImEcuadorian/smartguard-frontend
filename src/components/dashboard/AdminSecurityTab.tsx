"use client";

import { AlertTriangle, Bell, CheckCircle2, DoorOpen, Flame, Move, Thermometer } from "lucide-react";
import { useAcknowledgeAlert, useResolveAlert } from "@/hooks/useAlerts";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/Button";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { AlertsChart } from "./charts/AlertsChart";
import { DeviceStatusChart } from "./charts/DeviceStatusChart";
import { MetricCard } from "./MetricCard";
import { StatsOverview } from "./StatsOverview";

export function AdminSecurityTab({
  stats,
  sensorsData,
  states,
  isAdmin,
}: AdminDashboardTabProps) {
  const acknowledgeAlert = useAcknowledgeAlert();
  const resolveAlert = useResolveAlert();
  const sensorNameById = new Map(sensorsData.map((sensor) => [sensor.id, sensor.name]));
  const topSensors = Object.entries(
    stats.alerts.visible.reduce(
      (acc, alert) => {
        if (!alert.sensorId) return acc;
        acc[alert.sensorId] = (acc[alert.sensorId] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <StatsOverview>
        <MetricCard
          title="Alertas abiertas"
          value={stats.alerts.open}
          description="Pendientes de atencion"
          icon={AlertTriangle}
          tone={stats.alerts.open > 0 ? "red" : "emerald"}
          isLoading={states.alerts.isLoading}
          hasError={states.alerts.isError}
        />
        <MetricCard
          title="Alertas criticas"
          value={stats.alerts.critical}
          description="Riesgo alto"
          icon={Bell}
          tone={stats.alerts.critical > 0 ? "red" : "slate"}
          isLoading={states.alerts.isLoading}
          hasError={states.alerts.isError}
        />
        <MetricCard
          title="Reconocidas"
          value={stats.alerts.acknowledged}
          description="En seguimiento"
          icon={CheckCircle2}
          tone="amber"
          isLoading={states.alerts.isLoading}
          hasError={states.alerts.isError}
        />
        <MetricCard
          title="Resueltas"
          value={stats.alerts.resolved}
          description="Cerradas correctamente"
          icon={CheckCircle2}
          tone="emerald"
          isLoading={states.alerts.isLoading}
          hasError={states.alerts.isError}
        />
      </StatsOverview>

      <StatsOverview>
        <MetricCard
          title="Riesgo gas / humo"
          value={stats.kitchen.gasRisk ? "Activo" : "Normal"}
          description="Calculado desde alertas y sensores de gas"
          icon={Flame}
          tone={stats.kitchen.gasRisk ? "red" : "emerald"}
          isLoading={states.alerts.isLoading || states.sensors.isLoading}
          hasError={states.alerts.isError && states.sensors.isError}
        />
        <MetricCard
          title="Temperatura"
          value={stats.kitchen.temperatureRisk ? "Revision" : "Normal"}
          description="Riesgo por umbrales o alertas de temperatura"
          icon={Thermometer}
          tone={stats.kitchen.temperatureRisk ? "amber" : "emerald"}
          isLoading={states.alerts.isLoading || states.sensors.isLoading}
          hasError={states.alerts.isError && states.sensors.isError}
        />
        <MetricCard
          title="Puertas"
          value={stats.kitchen.doorOpen ? "Abierta" : "Sin alerta"}
          description="Eventos de puerta abierta en el rango"
          icon={DoorOpen}
          tone={stats.kitchen.doorOpen ? "amber" : "emerald"}
          isLoading={states.alerts.isLoading || states.sensors.isLoading}
          hasError={states.alerts.isError && states.sensors.isError}
        />
        <MetricCard
          title="Movimiento"
          value={stats.kitchen.motionDetected ? "Detectado" : "Normal"}
          description="Movimiento reportado por sensores o alertas"
          icon={Move}
          tone={stats.kitchen.motionDetected ? "amber" : "emerald"}
          isLoading={states.alerts.isLoading || states.sensors.isLoading}
          hasError={states.alerts.isError && states.sensors.isError}
        />
      </StatsOverview>

      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Alertas por severidad"
          description="Distribucion del riesgo en el rango seleccionado."
          icon={AlertTriangle}
        >
          {states.alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : states.alerts.isError ? (
            <ErrorState tone="warning" title="Alertas no disponibles" />
          ) : (
            <AlertsChart
              critical={stats.alerts.critical}
              warning={stats.alerts.warning}
              info={stats.alerts.info}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Alertas por estado"
          description="Abiertas, reconocidas y resueltas."
          icon={Bell}
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ActivityPanel
          title="Tabla de alertas recientes"
          description="Seguimiento operativo con acciones permitidas por backend."
          icon={AlertTriangle}
        >
          {states.alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : states.alerts.isError ? (
            <ErrorState
              tone="warning"
              title="Alertas no disponibles"
              description="No se pudo consultar el modulo de alertas."
            />
          ) : stats.alerts.visible.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Severidad</Th>
                  <Th>Estado</Th>
                  <Th>Mensaje</Th>
                  <Th>Fecha</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {stats.alerts.visible.slice(0, 10).map((alert) => (
                  <tr key={alert.id}>
                    <Td>
                      <SeverityBadge severity={alert.severity} />
                    </Td>
                    <Td>
                      <StatusBadge status={alert.status} />
                    </Td>
                    <Td className="max-w-md text-slate-100">{alert.message}</Td>
                    <Td>{formatDate(alert.occurredAt)}</Td>
                    <Td>
                      {isAdmin ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={alert.status !== "OPEN"}
                            isLoading={acknowledgeAlert.isPending}
                            onClick={() => acknowledgeAlert.mutate(alert.id)}
                          >
                            Reconocer
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={alert.status === "RESOLVED"}
                            isLoading={resolveAlert.isPending}
                            onClick={() => resolveAlert.mutate(alert.id)}
                          >
                            Resolver
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Solo lectura</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Sin alertas en el rango"
              description="No hay alertas recientes para mostrar."
            />
          )}
        </ActivityPanel>

        <ActivityPanel
          title="Top sensores con alertas"
          description="Sensores que mas generan eventos de seguridad."
          icon={Bell}
        >
          {topSensors.length ? (
            <div className="space-y-3">
              {topSensors.map(([sensorId, count]) => (
                <div
                  key={sensorId}
                  className="rounded-lg border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">
                        {sensorNameById.get(sensorId) ?? "Sensor no identificado"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {sensorId}
                      </p>
                    </div>
                    <span className="text-2xl font-semibold text-slate-50">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sin sensores asociados"
              description="Las alertas del rango no contienen sensorId suficiente para ranking."
            />
          )}
        </ActivityPanel>
      </section>
    </div>
  );
}
