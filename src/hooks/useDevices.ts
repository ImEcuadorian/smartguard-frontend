"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deviceApi } from "@/lib/api/smartguard-api";
import type { DeviceStatus, UUID } from "@/lib/api/types";

export function useDevices(params?: { status?: DeviceStatus }) {
  return useQuery({
    queryKey: ["devices", params],
    queryFn: () => deviceApi.list(params),
  });
}

export function useDevice(id: UUID | undefined) {
  return useQuery({
    queryKey: ["devices", id],
    queryFn: () => deviceApi.get(id as UUID),
    enabled: Boolean(id),
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deviceApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useUpdateDeviceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: UUID; status: DeviceStatus }) =>
      deviceApi.updateStatus(id, status),
    onSuccess: (_device, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["devices"] });
      void queryClient.invalidateQueries({ queryKey: ["devices", variables.id] });
    },
  });
}
