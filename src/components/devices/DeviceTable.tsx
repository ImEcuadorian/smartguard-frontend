"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { DeviceResponse, DeviceStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";

const statuses: DeviceStatus[] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export function DeviceTable({
  devices,
  canEdit,
  onStatusChange,
}: {
  devices: DeviceResponse[];
  canEdit: boolean;
  onStatusChange: (id: string, status: DeviceStatus) => void;
}) {
  if (!devices.length) {
    return (
      <EmptyState
        title="Sin dispositivos"
        description="No hay ESP32 registrados para los filtros actuales."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Codigo</Th>
          <Th>Nombre</Th>
          <Th>Estado</Th>
          <Th>Ubicacion</Th>
          <Th>IP</Th>
          <Th>Firmware</Th>
          <Th>Ultima conexion</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {devices.map((device) => (
          <tr key={device.id}>
            <Td className="font-mono text-xs">{device.code}</Td>
            <Td className="font-medium text-slate-100">{device.name}</Td>
            <Td>
              {canEdit ? (
                <Select
                  value={device.status}
                  onChange={(event) =>
                    onStatusChange(device.id, event.target.value as DeviceStatus)
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
                <StatusBadge status={device.status} />
              )}
            </Td>
            <Td>{device.location ?? "Sin ubicacion"}</Td>
            <Td>{device.ipAddress ?? "Sin IP"}</Td>
            <Td>{device.firmwareVersion ?? "Sin version"}</Td>
            <Td>{formatDate(device.lastSeenAt)}</Td>
            <Td>
              <Link
                href={`/devices/${device.id}`}
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
