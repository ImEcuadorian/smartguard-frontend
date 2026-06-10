import type { SensorResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RecentReadings({ sensors }: { sensors: SensorResponse[] }) {
  const sorted = [...sensors]
    .filter((sensor) => sensor.lastReadingAt)
    .sort(
      (a, b) =>
        new Date(b.lastReadingAt ?? 0).getTime() -
        new Date(a.lastReadingAt ?? 0).getTime(),
    );

  if (!sorted.length) {
    return (
      <EmptyState
        title="Sin lecturas recientes"
        description="Los sensores todavia no reportan actividad."
      />
    );
  }

  return (
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
        {sorted.slice(0, 6).map((sensor) => (
          <tr key={sensor.id}>
            <Td className="font-medium text-slate-100">{sensor.name}</Td>
            <Td>{sensor.type}</Td>
            <Td>
              <StatusBadge status={sensor.status} />
            </Td>
            <Td>{formatDate(sensor.lastReadingAt)}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
