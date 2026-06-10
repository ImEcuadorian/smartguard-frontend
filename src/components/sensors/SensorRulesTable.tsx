"use client";

import type { SensorAlertRuleResponse } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function SensorRulesTable({
  rules,
  canEdit,
  isDisabling,
  onDisable,
}: {
  rules: SensorAlertRuleResponse[];
  canEdit: boolean;
  isDisabling?: boolean;
  onDisable: (id: string) => void;
}) {
  if (!rules.length) {
    return (
      <EmptyState
        title="Sin reglas"
        description="Este sensor aun no tiene reglas de alerta."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Tipo</Th>
          <Th>Condicion</Th>
          <Th>Alerta</Th>
          <Th>Severidad</Th>
          <Th>Estado</Th>
          <Th>Acciones</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {rules.map((rule) => (
          <tr key={rule.id}>
            <Td>{rule.type}</Td>
            <Td>{describeRule(rule)}</Td>
            <Td>{rule.alertType}</Td>
            <Td>
              <SeverityBadge severity={rule.severity} />
            </Td>
            <Td>
              <StatusBadge status={rule.enabled ? "ACTIVE" : "INACTIVE"} />
            </Td>
            <Td>
              {canEdit && rule.enabled ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={isDisabling}
                  onClick={() => onDisable(rule.id)}
                >
                  Desactivar
                </Button>
              ) : (
                <span className="text-xs text-slate-400">Sin acciones</span>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function describeRule(rule: SensorAlertRuleResponse) {
  if (rule.type === "NUMERIC_THRESHOLD") {
    return `${rule.operator ?? "N/A"} ${rule.thresholdValue ?? "N/A"}`;
  }

  if (rule.type === "BOOLEAN_MATCH") {
    return `Valor booleano ${String(rule.expectedBooleanValue)}`;
  }

  if (rule.type === "DURATION_OPEN") {
    return `${rule.durationMinutes ?? 0} minutos abierto`;
  }

  return `${rule.durationMinutes ?? 0} minutos sin lectura`;
}
