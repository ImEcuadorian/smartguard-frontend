"use client";

import { useState } from "react";
import type { ActuatorCommandType, ActuatorResponse } from "@/lib/api/types";
import { useActuatorCommands, useSendActuatorCommand } from "@/hooks/useActuators";
import { canOperate } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/api/types";
import { formatDate } from "@/lib/utils/format-date";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Label } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";

const commands: ActuatorCommandType[] = [
  "OPEN_DOOR",
  "CLOSE_DOOR",
  "LOCK",
  "UNLOCK",
  "TURN_ON",
  "TURN_OFF",
  "BEEP",
];

const importantCommands: ActuatorCommandType[] = ["UNLOCK", "OPEN_DOOR"];

export function ActuatorCommandPanel({
  actuator,
  role,
}: {
  actuator: ActuatorResponse | null;
  role?: UserRole;
}) {
  const [payload, setPayload] = useState("");
  const [pendingCommand, setPendingCommand] = useState<ActuatorCommandType | null>(
    null,
  );
  const commandHistory = useActuatorCommands(actuator?.id);
  const sendCommand = useSendActuatorCommand(actuator?.id);
  const allowed = canOperate(role);

  async function submitCommand(command: ActuatorCommandType) {
    await sendCommand.mutateAsync({
      command,
      payload: payload.trim() || null,
    });
    setPendingCommand(null);
  }

  if (!actuator) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            title="Selecciona un actuador"
            description="Elige un actuador de la tabla para ver comandos e historial."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comandos para {actuator.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label htmlFor="command-payload">Payload JSON opcional</Label>
          <Input
            id="command-payload"
            placeholder='{"durationSeconds":5}'
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            disabled={!allowed}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {commands.map((command) => (
            <Button
              key={command}
              type="button"
              variant={importantCommands.includes(command) ? "danger" : "secondary"}
              size="sm"
              disabled={!allowed}
              onClick={() =>
                importantCommands.includes(command)
                  ? setPendingCommand(command)
                  : void submitCommand(command)
              }
            >
              {command}
            </Button>
          ))}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-100">
            Historial de comandos
          </h3>
          {commandHistory.isLoading ? <LoadingState /> : null}
          {commandHistory.data?.length ? (
            <DataTable>
              <thead>
                <tr>
                  <Th>Comando</Th>
                  <Th>Estado</Th>
                  <Th>Payload</Th>
                  <Th>Creado</Th>
                  <Th>Enviado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {commandHistory.data.map((command) => (
                  <tr key={command.id}>
                    <Td>{command.command}</Td>
                    <Td>
                      <StatusBadge status={command.status} />
                    </Td>
                    <Td className="font-mono text-xs">{command.payload ?? "N/A"}</Td>
                    <Td>{formatDate(command.createdAt)}</Td>
                    <Td>{formatDate(command.sentAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : null}
        </div>
      </CardContent>
      <ConfirmDialog
        open={Boolean(pendingCommand)}
        title="Confirmar comando importante"
        description={`El comando ${pendingCommand ?? ""} puede abrir o desbloquear un acceso fisico.`}
        confirmLabel="Enviar comando"
        isLoading={sendCommand.isPending}
        onCancel={() => setPendingCommand(null)}
        onConfirm={() => {
          if (pendingCommand) void submitCommand(pendingCommand);
        }}
      />
    </Card>
  );
}
