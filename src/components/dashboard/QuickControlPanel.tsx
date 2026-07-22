"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BellRing,
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Loader2,
  Power,
  RadioTower,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ActuatorCommandType,
  ActuatorResponse,
  ActuatorType,
} from "@/lib/api/types";
import { useSendActuatorCommand } from "@/hooks/useActuators";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface QuickCommand {
  label: string;
  command: ActuatorCommandType;
  variant?: "primary" | "secondary" | "danger";
  confirm?: boolean;
}

const commandLabels: Record<ActuatorCommandType, string> = {
  OPEN_DOOR: "Abrir puerta",
  CLOSE_DOOR: "Cerrar puerta",
  LOCK: "Bloquear",
  UNLOCK: "Desbloquear",
  TURN_ON: "Encender",
  TURN_OFF: "Apagar",
  BEEP: "Activar buzzer",
};

function getCommands(type: ActuatorType): QuickCommand[] {
  if (type === "BUZZER") {
    return [
      { label: "Activar buzzer", command: "BEEP", variant: "danger", confirm: true },
      { label: "Apagar buzzer", command: "TURN_OFF", variant: "secondary" },
    ];
  }

  if (type === "SOLENOID_LOCK") {
    return [
      { label: "Bloquear puerta", command: "LOCK", variant: "primary", confirm: true },
      { label: "Desbloquear puerta", command: "UNLOCK", variant: "danger", confirm: true },
    ];
  }

  if (type === "SERVO") {
    return [
      { label: "Abrir", command: "OPEN_DOOR", variant: "danger", confirm: true },
      { label: "Cerrar", command: "CLOSE_DOOR", variant: "primary", confirm: true },
    ];
  }

  return [
    { label: "Encender", command: "TURN_ON", variant: "primary" },
    { label: "Apagar", command: "TURN_OFF", variant: "secondary" },
  ];
}

const actuatorIcons: Record<ActuatorType, LucideIcon> = {
  BUZZER: BellRing,
  SOLENOID_LOCK: DoorClosed,
  SERVO: DoorOpen,
  LED: Lightbulb,
  RELAY: Power,
};

function QuickControlItem({ actuator }: { actuator: ActuatorResponse }) {
  const queryClient = useQueryClient();
  const sendCommand = useSendActuatorCommand(actuator.id);
  const [pending, setPending] = useState<QuickCommand | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const Icon = actuatorIcons[actuator.type] ?? RadioTower;
  const commands = getCommands(actuator.type);

  async function submit(command: QuickCommand) {
    setLastResult(null);
    try {
      const response = await sendCommand.mutateAsync({
        command: command.command,
      });
      setLastResult(`${commandLabels[command.command]}: ${response.status}`);
      void queryClient.invalidateQueries({ queryKey: ["actuators"] });
    } catch (error) {
      setLastResult(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el comando al actuador.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/35 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-100">
            {actuator.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {actuator.type}
            {actuator.location ? ` · ${actuator.location}` : ""}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[var(--sg-primary)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={actuator.status} />
        {sendCommand.isPending ? (
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Enviando
          </span>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {commands.map((command) => (
          <Button
            key={command.command}
            type="button"
            size="sm"
            variant={command.variant ?? "secondary"}
            disabled={actuator.status !== "ACTIVE"}
            isLoading={sendCommand.isPending && pending?.command === command.command}
            onClick={() =>
              command.confirm ? setPending(command) : void submit(command)
            }
          >
            {command.label}
          </Button>
        ))}
      </div>
      {lastResult ? (
        <p className="mt-3 text-xs leading-5 text-slate-400">{lastResult}</p>
      ) : null}
      <ConfirmDialog
        open={Boolean(pending)}
        title="Confirmar accion critica"
        description={`Enviar ${pending?.label ?? "este comando"} a ${actuator.name}.`}
        confirmLabel="Enviar comando"
        isLoading={sendCommand.isPending}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) void submit(pending);
        }}
      />
    </article>
  );
}

export function QuickControlPanel({
  actuators,
  isLoading,
  isError,
}: {
  actuators: ActuatorResponse[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (isLoading) return <LoadingState label="Cargando actuadores" />;

  if (isError) {
    return (
      <ErrorState
        tone="warning"
        title="Actuadores no disponibles"
        description="No se pudo cargar control rapido. El resto del dashboard sigue disponible."
      />
    );
  }

  if (!actuators.length) {
    return (
      <EmptyState
        title="No hay actuadores disponibles para control rapido"
        description="Cuando existan buzzer, cerradura, rele o LED se mostraran aqui."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 p-4 text-amber-100 xl:col-span-2">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm leading-6">
            Las acciones fisicas usan comandos reales del backend. Las acciones
            criticas solicitan confirmacion antes de enviarse.
          </p>
        </div>
      </div>
      {actuators.slice(0, 6).map((actuator) => (
        <QuickControlItem key={actuator.id} actuator={actuator} />
      ))}
    </div>
  );
}
