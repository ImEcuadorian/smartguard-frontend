"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actuatorApi } from "@/lib/api/smartguard-api";
import type { ActuatorCommandType, UUID } from "@/lib/api/types";

export function useActuators() {
  return useQuery({
    queryKey: ["actuators"],
    queryFn: actuatorApi.list,
  });
}

export function useActuatorCommands(id: UUID | undefined) {
  return useQuery({
    queryKey: ["actuators", id, "commands"],
    queryFn: () => actuatorApi.commands(id as UUID),
    enabled: Boolean(id),
  });
}

export function useSendActuatorCommand(id: UUID | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      command,
      payload,
    }: {
      command: ActuatorCommandType;
      payload?: string | null;
    }) => actuatorApi.sendCommand(id as UUID, command, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["actuators", id, "commands"],
      });
    },
  });
}
