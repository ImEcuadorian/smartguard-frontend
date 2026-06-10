"use client";

import type { AlertSeverity, AlertStatus } from "@/lib/api/types";
import { Select } from "@/components/ui/Select";

export function AlertFilters({
  status,
  severity,
  onStatusChange,
  onSeverityChange,
}: {
  status: AlertStatus | "";
  severity: AlertSeverity | "";
  onStatusChange: (status: AlertStatus | "") => void;
  onSeverityChange: (severity: AlertSeverity | "") => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as AlertStatus | "")}
      >
        <option value="">Todos los estados</option>
        <option value="OPEN">OPEN</option>
        <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
        <option value="RESOLVED">RESOLVED</option>
      </Select>
      <Select
        value={severity}
        onChange={(event) =>
          onSeverityChange(event.target.value as AlertSeverity | "")
        }
      >
        <option value="">Todas las severidades</option>
        <option value="INFO">INFO</option>
        <option value="WARNING">WARNING</option>
        <option value="CRITICAL">CRITICAL</option>
      </Select>
    </div>
  );
}
