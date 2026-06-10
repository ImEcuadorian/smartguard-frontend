"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertApi } from "@/lib/api/smartguard-api";
import type { AlertSeverity, AlertStatus, UUID } from "@/lib/api/types";

export function useAlerts(params?: {
  status?: AlertStatus;
  severity?: AlertSeverity;
}) {
  return useQuery({
    queryKey: ["alerts", params],
    queryFn: () => alertApi.list(params),
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => alertApi.acknowledge(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => alertApi.resolve(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}
