"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDevice, useUpdateDeviceStatus } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import type { DeviceStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";

const statuses: DeviceStatus[] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export function DeviceDetailPage({ deviceId }: { deviceId: string }) {
  const device = useDevice(deviceId);
  const sensors = useSensors({ deviceId });
  const updateStatus = useUpdateDeviceStatus();

  if (device.isLoading) return <LoadingState label="Cargando dispositivo" />;
  if (device.isError || !device.data) return <ErrorState />;

  return (
    <>
      <PageHeader
        title={device.data.name}
        description={`Codigo ${device.data.code}`}
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
      <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
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
                className="max-w-44"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
            <Info label="Ubicacion" value={device.data.location ?? "Sin ubicacion"} />
            <Info label="IP" value={device.data.ipAddress ?? "Sin IP"} />
            <Info
              label="Firmware"
              value={device.data.firmwareVersion ?? "Sin version"}
            />
            <Info label="Ultima conexion" value={formatDate(device.data.lastSeenAt)} />
            <Info label="Creado" value={formatDate(device.data.createdAt)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sensores asociados</CardTitle>
          </CardHeader>
          <CardContent>
            {sensors.isLoading ? <LoadingState /> : null}
            {sensors.data?.length ? (
              <DataTable>
                <thead>
                  <tr>
                    <Th>Codigo</Th>
                    <Th>Nombre</Th>
                    <Th>Tipo</Th>
                    <Th>Estado</Th>
                    <Th>Ultima lectura</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sensors.data.map((sensor) => (
                    <tr key={sensor.id}>
                      <Td className="font-mono text-xs">{sensor.code}</Td>
                      <Td>
                        <Link
                          href={`/sensors/${sensor.id}`}
                          className="font-medium text-[var(--sg-primary)] hover:text-slate-100"
                        >
                          {sensor.name}
                        </Link>
                      </Td>
                      <Td>{sensor.type}</Td>
                      <Td>
                        <StatusBadge status={sensor.status} />
                      </Td>
                      <Td>{formatDate(sensor.lastReadingAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            ) : !sensors.isLoading ? (
              <EmptyState
                title="Sin sensores asociados"
                description="Este dispositivo aun no tiene sensores registrados."
              />
            ) : null}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  );
}
