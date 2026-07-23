import { CircuitBoard, RadioReceiver } from "lucide-react";
import type { SensorType } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { getSensorTypeLabel } from "@/lib/utils/sensor-display";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "./ActivityPanel";
import type { AdminDashboardTabProps } from "./AdminDashboardTabs";
import { DeviceStatusChart } from "./charts/DeviceStatusChart";
import { DeviceStatsPanel } from "./DeviceStatsPanel";
import { SensorSummaryPanel } from "./SensorSummaryPanel";

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

export function AdminDevicesSensorsTab({
  stats,
  devicesData,
  sensorsData,
  actuatorsData,
  states,
  refreshInterval,
}: AdminDashboardTabProps) {
  const sensorTypeItems = Object.entries(stats.sensors.byType).map(
    ([type, value], index) => ({
      label: getSensorTypeLabel(type as SensorType),
      value: value ?? 0,
      color: sensorTypeColors[index % sensorTypeColors.length],
    }),
  );
  const recentSensors = [...sensorsData]
    .filter((sensor) => sensor.lastReadingAt)
    .sort(
      (a, b) =>
        new Date(b.lastReadingAt ?? 0).getTime() -
        new Date(a.lastReadingAt ?? 0).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Distribucion de dispositivos"
          description="Estado operativo del inventario ESP32."
          icon={CircuitBoard}
        >
          <DeviceStatusChart
            title="Dispositivos por estado"
            items={[
              { label: "Activos", value: stats.devices.active, color: "bg-emerald-400" },
              { label: "Inactivos", value: stats.devices.inactive, color: "bg-slate-500" },
              { label: "Mantenimiento", value: stats.devices.maintenance, color: "bg-amber-400" },
            ]}
          />
        </ActivityPanel>
        <ActivityPanel
          title="Sensores por tipo"
          description="Distribucion funcional de sensores conectados."
          icon={RadioReceiver}
        >
          <DeviceStatusChart title="Tipos de sensor" items={sensorTypeItems} />
        </ActivityPanel>
      </section>

      <section>
        <SectionHeader
          title="Estadisticas por dispositivo"
          description="Sensores, actuadores, alertas y salud estimada por ESP32."
        />
        <DeviceStatsPanel
          devices={devicesData}
          sensors={sensorsData}
          actuators={actuatorsData}
          alerts={stats.alerts.visible}
          limit={6}
        />
      </section>

      <ActivityPanel
        title="Sensores importantes"
        description="Estado visual de puerta, movimiento, gas, emergencia y sensores numericos."
        icon={RadioReceiver}
      >
        {states.sensors.isLoading ? (
          <LoadingState label="Cargando sensores" />
        ) : states.sensors.isError ? (
          <ErrorState
            tone="warning"
            title="Sensores no disponibles"
            description="No se pudo cargar el modulo de sensores."
          />
        ) : (
          <SensorSummaryPanel
            sensors={sensorsData}
            limit={12}
            refetchInterval={refreshInterval}
          />
        )}
      </ActivityPanel>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ActivityPanel
          title="Lista resumida de dispositivos"
          description="Vista compacta sin salir del dashboard."
          icon={CircuitBoard}
        >
          {states.devices.isLoading ? (
            <LoadingState label="Cargando dispositivos" />
          ) : states.devices.isError ? (
            <ErrorState
              tone="warning"
              title="Dispositivos no disponibles"
              description="No se pudo cargar el inventario de dispositivos."
            />
          ) : devicesData.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Dispositivo</Th>
                  <Th>Estado</Th>
                  <Th>Ubicacion</Th>
                  <Th>Ultima conexion</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {devicesData.slice(0, 8).map((device) => (
                  <tr key={device.id}>
                    <Td>
                      <div>
                        <p className="font-medium text-slate-100">{device.name}</p>
                        <p className="font-mono text-xs text-slate-500">{device.code}</p>
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge status={device.status} />
                    </Td>
                    <Td>{device.location ?? "Sin ubicacion"}</Td>
                    <Td>{formatDate(device.lastSeenAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Sin dispositivos"
              description="No hay dispositivos registrados para mostrar."
            />
          )}
        </ActivityPanel>

        <ActivityPanel
          title="Ultimas lecturas por sensor"
          description="Sensores ordenados por actividad reciente."
          icon={RadioReceiver}
        >
          {states.sensors.isLoading ? (
            <LoadingState label="Cargando lecturas" />
          ) : states.sensors.isError ? (
            <ErrorState tone="warning" title="Lecturas no disponibles" />
          ) : recentSensors.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Sensor</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th>Ultima lectura</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentSensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <Td className="font-medium text-slate-100">{sensor.name}</Td>
                    <Td>{getSensorTypeLabel(sensor.type)}</Td>
                    <Td>
                      <StatusBadge status={sensor.status} />
                    </Td>
                    <Td>{formatDate(sensor.lastReadingAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Sin lecturas recientes"
              description="Aun no hay actividad suficiente de sensores."
            />
          )}
        </ActivityPanel>
      </section>
    </div>
  );
}
