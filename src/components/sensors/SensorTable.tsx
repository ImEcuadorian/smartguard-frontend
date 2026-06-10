"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { SensorResponse, SensorStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";

const statuses: SensorStatus[] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export function SensorTable({
  sensors,
  canEdit,
  onStatusChange,
}: {
  sensors: SensorResponse[];
  canEdit: boolean;
  onStatusChange: (id: string, status: SensorStatus) => void;
}) {
  if (!sensors.length) {
    return (
      <EmptyState
        title="Sin sensores"
        description="No hay sensores registrados para los filtros actuales."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Codigo</Th>
          <Th>Nombre</Th>
          <Th>Tipo</Th>
          <Th>Unidad</Th>
          <Th>Estado</Th>
          <Th>Dispositivo</Th>
          <Th>Ubicacion</Th>
          <Th>Ultima lectura</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {sensors.map((sensor) => (
          <tr key={sensor.id}>
            <Td className="font-mono text-xs">{sensor.code}</Td>
            <Td className="font-medium text-slate-100">{sensor.name}</Td>
            <Td>{sensor.type}</Td>
            <Td>{sensor.unit ?? "N/A"}</Td>
            <Td>
              {canEdit ? (
                <Select
                  value={sensor.status}
                  onChange={(event) =>
                    onStatusChange(sensor.id, event.target.value as SensorStatus)
                  }
                  className="min-w-36"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              ) : (
                <StatusBadge status={sensor.status} />
              )}
            </Td>
            <Td className="font-mono text-xs">{sensor.deviceId}</Td>
            <Td>{sensor.location ?? "Sin ubicacion"}</Td>
            <Td>{formatDate(sensor.lastReadingAt)}</Td>
            <Td>
              <Link
                href={`/sensors/${sensor.id}`}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 text-sm font-medium text-slate-100 transition hover:bg-white/15"
              >
                <Eye className="h-4 w-4" />
                Ver
              </Link>
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
