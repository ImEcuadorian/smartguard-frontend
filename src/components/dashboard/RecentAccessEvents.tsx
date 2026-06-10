import type { AccessEventResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RecentAccessEvents({ events }: { events: AccessEventResponse[] }) {
  if (!events.length) {
    return (
      <EmptyState
        title="Sin eventos RFID"
        description="Aun no hay escaneos de tarjetas registrados."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Tarjeta</Th>
          <Th>Resultado</Th>
          <Th>Motivo</Th>
          <Th>Fecha</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {events.slice(0, 6).map((event) => (
          <tr key={event.id}>
            <Td className="font-mono text-xs">{event.cardUid}</Td>
            <Td>
              <StatusBadge status={event.result} />
            </Td>
            <Td>{event.reason}</Td>
            <Td>{formatDate(event.occurredAt)}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
