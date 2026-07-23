"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Fingerprint, Info, RadioReceiver } from "lucide-react";
import { useAccessEvents } from "@/hooks/useAccessEvents";
import { useActuators } from "@/hooks/useActuators";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useDevice, useUpdateDeviceStatus } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import type { DeviceStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { getAccessResultLabel, getStatusLabel } from "@/lib/utils/labels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { DeviceActuatorStats } from "./DeviceActuatorStats";
import { DeviceSensorStats } from "./DeviceSensorStats";
import { DeviceStatsCards } from "./DeviceStatsCards";

const statuses: DeviceStatus[] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];
const REFRESH_INTERVAL = 30_000;

export function DeviceDetailPage({ deviceId }: { deviceId: string }) {
  const { role } = useAuth();
  const device = useDevice(deviceId);
  const sensors = useSensors({ deviceId }, { refetchInterval: REFRESH_INTERVAL });
  const actuators = useActuators({ refetchInterval: REFRESH_INTERVAL });
  const alerts = useAlerts(undefined, { refetchInterval: REFRESH_INTERVAL });
  const accessEvents = useAccessEvents(
    { limit: 80 },
    { refetchInterval: REFRESH_INTERVAL },
  );
  const updateStatus = useUpdateDeviceStatus();

  if (device.isLoading) return <LoadingState label="Cargando dispositivo" />;
  if (device.isError || !device.data) return <ErrorState />;

  const relatedSensors = sensors.data ?? [];
  const relatedActuators = (actuators.data ?? []).filter(
    (actuator) => actuator.deviceId === device.data.id,
  );
  const relatedAlerts = (alerts.data ?? []).filter(
    (alert) => alert.deviceId === device.data.id,
  );
  const relatedAccessEvents = (accessEvents.data ?? []).filter(
    (event) => event.deviceId === device.data.id,
  );

  return (
    <>
      <PageHeader
        title={device.data.name}
        description={`Codigo ${device.data.code}. Estadisticas relacionadas sin llamadas nuevas al backend.`}
        actions={
          <Link
            href="/devices"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />

      <div className="space-y-6">
        <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <Card>
            <CardHeader>
              <CardTitle>Informacion general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Estado</span>
                <Select
                  value={device.data.status}
                  onChange={(event) =>
                    updateStatus.mutate({
                      id: device.data.id,
                      status: event.target.value as DeviceStatus,
                    })
                  }
                  className="max-w-48"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </Select>
              </div>
              <InfoRow label="Ubicacion" value={device.data.location ?? "Sin ubicacion"} />
              <InfoRow label="IP" value={device.data.ipAddress ?? "Sin IP"} />
              <InfoRow
                label="Firmware"
                value={device.data.firmwareVersion ?? "Sin version"}
              />
              <InfoRow label="Ultima conexion" value={formatDate(device.data.lastSeenAt)} />
              <InfoRow label="Creado" value={formatDate(device.data.createdAt)} />
            </CardContent>
          </Card>

          <section>
            <SectionHeader
              title="Resumen operativo del dispositivo"
              description="Salud, sensores, actuadores y alertas relacionadas por deviceId."
            />
            <DeviceStatsCards
              device={device.data}
              sensors={relatedSensors}
              actuators={relatedActuators}
              alerts={relatedAlerts}
            />
          </section>
        </section>

        <ActivityPanel
          title="Sensores del dispositivo"
          description="Lectura, estado visual, interpretacion humana y ultima actualizacion."
          icon={RadioReceiver}
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores asociados" />
          ) : sensors.isError ? (
            <ErrorState
              tone="warning"
              title="Sensores no disponibles"
              description="No se pudo consultar sensores relacionados."
            />
          ) : (
            <DeviceSensorStats
              sensors={relatedSensors}
              refetchInterval={REFRESH_INTERVAL}
            />
          )}
        </ActivityPanel>

        <section>
          <SectionHeader
            title="Actuadores del dispositivo"
            description="Estado, tipo y controles permitidos con comandos existentes."
          />
          {actuators.isLoading ? (
            <LoadingState label="Cargando actuadores relacionados" />
          ) : actuators.isError ? (
            <ErrorState
              tone="warning"
              title="Actuadores no disponibles"
              description="No se pudo consultar actuadores."
            />
          ) : (
            <DeviceActuatorStats actuators={relatedActuators} role={role} />
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ActivityPanel
            title="Alertas del dispositivo"
            description="Alertas relacionadas cuando el backend devuelve deviceId."
            icon={Bell}
          >
            {alerts.isLoading ? (
              <LoadingState label="Cargando alertas" />
            ) : alerts.isError ? (
              <ErrorState tone="warning" title="Alertas no disponibles" />
            ) : relatedAlerts.length ? (
              <DataTable>
                <thead>
                  <tr>
                    <Th>Severidad</Th>
                    <Th>Estado</Th>
                    <Th>Mensaje</Th>
                    <Th>Fecha</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {relatedAlerts.slice(0, 8).map((alert) => (
                    <tr key={alert.id}>
                      <Td>
                        <SeverityBadge severity={alert.severity} />
                      </Td>
                      <Td>
                        <StatusBadge status={alert.status} />
                      </Td>
                      <Td className="max-w-sm text-slate-100">{alert.message}</Td>
                      <Td>{formatDate(alert.occurredAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            ) : (
              <EmptyState
                title="No hay alertas activas"
                description="No hay datos relacionados disponibles para este dispositivo."
              />
            )}
          </ActivityPanel>

          <ActivityPanel
            title="Eventos RFID relacionados"
            description="Accesos concedidos o rechazados asociados al dispositivo."
            icon={Fingerprint}
          >
            {accessEvents.isLoading ? (
              <LoadingState label="Cargando eventos RFID" />
            ) : accessEvents.isError ? (
              <ErrorState tone="info" title="RFID no disponible" />
            ) : relatedAccessEvents.length ? (
              <DataTable>
                <thead>
                  <tr>
                    <Th>Resultado</Th>
                    <Th>Tarjeta</Th>
                    <Th>Motivo</Th>
                    <Th>Fecha</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {relatedAccessEvents.slice(0, 8).map((event) => (
                    <tr key={event.id}>
                      <Td>
                        <StatusBadge status={event.result} />
                      </Td>
                      <Td className="font-mono text-xs">{event.cardUid}</Td>
                      <Td>{event.reason || getAccessResultLabel(event.result)}</Td>
                      <Td>{formatDate(event.occurredAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            ) : (
              <EmptyState
                title="Sin eventos RFID relacionados"
                description="No hay datos relacionados disponibles para este dispositivo."
              />
            )}
          </ActivityPanel>
        </section>

        {!relatedSensors.length && !relatedActuators.length && !relatedAlerts.length ? (
          <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-400">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sg-primary)]" />
              <p>No hay datos relacionados disponibles para este dispositivo.</p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  );
}
