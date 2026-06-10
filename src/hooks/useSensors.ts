"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sensorApi } from "@/lib/api/smartguard-api";
import type {
  AlertSeverity,
  AlertType,
  ComparisonOperator,
  SensorAlertRuleType,
  SensorStatus,
  SensorType,
  UUID,
} from "@/lib/api/types";

export function useSensors(params?: {
  deviceId?: UUID;
  status?: SensorStatus;
  type?: SensorType;
}) {
  return useQuery({
    queryKey: ["sensors", params],
    queryFn: () => sensorApi.list(params),
  });
}

export function useSensor(id: UUID | undefined) {
  return useQuery({
    queryKey: ["sensors", id],
    queryFn: () => sensorApi.get(id as UUID),
    enabled: Boolean(id),
  });
}

export function useCreateSensor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sensorApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sensors"] });
    },
  });
}

export function useUpdateSensorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: UUID; status: SensorStatus }) =>
      sensorApi.updateStatus(id, status),
    onSuccess: (_sensor, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["sensors"] });
      void queryClient.invalidateQueries({ queryKey: ["sensors", variables.id] });
    },
  });
}

export function useLatestSensorReading(id: UUID | undefined) {
  return useQuery({
    queryKey: ["sensors", id, "readings", "latest"],
    queryFn: () => sensorApi.latestReading(id as UUID),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useSensorReadings(
  id: UUID | undefined,
  params: { from?: string; to?: string; limit?: number } = { limit: 24 },
) {
  return useQuery({
    queryKey: ["sensors", id, "readings", params],
    queryFn: () => sensorApi.readings(id as UUID, params),
    enabled: Boolean(id),
  });
}

export function useSensorRules(id: UUID | undefined) {
  return useQuery({
    queryKey: ["sensors", id, "rules"],
    queryFn: () => sensorApi.rules(id as UUID),
    enabled: Boolean(id),
  });
}

export function useCreateSensorRule(sensorId: UUID | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      type: SensorAlertRuleType;
      operator?: ComparisonOperator | null;
      thresholdValue?: number | null;
      expectedBooleanValue?: boolean | null;
      durationMinutes?: number | null;
      alertType: AlertType;
      severity: AlertSeverity;
      message: string;
    }) => sensorApi.createRule(sensorId as UUID, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["sensors", sensorId, "rules"],
      });
    },
  });
}

export function useDisableSensorRule(sensorId: UUID | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: UUID) => sensorApi.disableRule(ruleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["sensors", sensorId, "rules"],
      });
    },
  });
}
