"use client";

import type { AlertResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/Button";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AlertsTable({
  alerts,
  canOperate,
  onAcknowledge,
  onResolve,
  isMutating,
}: {
  alerts: AlertResponse[];
  canOperate: boolean;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  isMutating?: boolean;
}) {
  if (!alerts.length) {
    return (
      <EmptyState
        title="Sin alertas"
        description="No hay alertas para los filtros actuales."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Severidad</Th>
          <Th>Estado</Th>
          <Th>Tipo</Th>
          <Th>Mensaje</Th>
          <Th>Fecha</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {alerts.map((alert) => (
          <tr key={alert.id}>
            <Td>
              <SeverityBadge severity={alert.severity} />
            </Td>
            <Td>
              <StatusBadge status={alert.status} />
            </Td>
            <Td>{alert.type}</Td>
            <Td className="max-w-lg text-slate-100">{alert.message}</Td>
            <Td>{formatDate(alert.occurredAt)}</Td>
            <Td>
              {canOperate ? (
                <div className="flex flex-wrap gap-2">
                  {alert.status === "OPEN" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isLoading={isMutating}
                      onClick={() => onAcknowledge(alert.id)}
                    >
                      Reconocer
                    </Button>
                  ) : null}
                  {alert.status !== "RESOLVED" ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      isLoading={isMutating}
                      onClick={() => onResolve(alert.id)}
                    >
                      Resolver
                    </Button>
                  ) : null}
                </div>
              ) : (
                <span className="text-xs text-slate-400">Solo lectura</span>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
