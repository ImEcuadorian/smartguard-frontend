import type { AlertResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RecentAlerts({ alerts }: { alerts: AlertResponse[] }) {
  if (!alerts.length) {
    return (
      <EmptyState
        title="Sin alertas abiertas"
        description="El sistema no reporta alertas pendientes."
      />
    );
  }

  return (
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
        {alerts.slice(0, 6).map((alert) => (
          <tr key={alert.id}>
            <Td>
              <SeverityBadge severity={alert.severity} />
            </Td>
            <Td>
              <StatusBadge status={alert.status} />
            </Td>
            <Td className="max-w-md text-slate-100">{alert.message}</Td>
            <Td>{formatDate(alert.occurredAt)}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
