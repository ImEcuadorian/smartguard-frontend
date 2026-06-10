"use client";

import type { ActuatorResponse } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ActuatorTable({
  actuators,
  selectedId,
  onSelect,
}: {
  actuators: ActuatorResponse[];
  selectedId?: string;
  onSelect: (actuator: ActuatorResponse) => void;
}) {
  if (!actuators.length) {
    return (
      <EmptyState
        title="Sin actuadores"
        description="No hay reles, cerraduras, buzzer, LED, servo o solenoid lock registrados."
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
          <Th>Estado</Th>
          <Th>Dispositivo</Th>
          <Th>Ubicacion</Th>
          <Th>Control</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {actuators.map((actuator) => (
          <tr key={actuator.id}>
            <Td className="font-mono text-xs">{actuator.code}</Td>
            <Td className="font-medium text-slate-100">{actuator.name}</Td>
            <Td>{actuator.type}</Td>
            <Td>
              <StatusBadge status={actuator.status} />
            </Td>
            <Td className="font-mono text-xs">{actuator.deviceId}</Td>
            <Td>{actuator.location ?? "Sin ubicacion"}</Td>
            <Td>
              <Button
                type="button"
                variant={selectedId === actuator.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => onSelect(actuator)}
              >
                Controlar
              </Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
