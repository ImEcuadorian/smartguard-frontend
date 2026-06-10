import type { AccessEventResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AccessEventsTable({ events }: { events: AccessEventResponse[] }) {
  if (!events.length) {
    return (
      <EmptyState
        title="Sin eventos"
        description="No hay eventos RFID para mostrar."
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
          <Th>Lector</Th>
          <Th>Dispositivo</Th>
          <Th>Fecha</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {events.map((event) => (
          <tr key={event.id}>
            <Td className="font-mono text-xs">{event.cardUid}</Td>
            <Td>
              <StatusBadge status={event.result} />
            </Td>
            <Td>{event.reason}</Td>
            <Td className="font-mono text-xs">{event.readerId}</Td>
            <Td className="font-mono text-xs">{event.deviceId}</Td>
            <Td>{formatDate(event.occurredAt)}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
