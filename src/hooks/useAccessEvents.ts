"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accessApi } from "@/lib/api/smartguard-api";

type QueryRefreshOptions = {
  refetchInterval?: number | false;
};

export function useAccessReaders(options?: QueryRefreshOptions) {
  return useQuery({
    queryKey: ["access", "readers"],
    queryFn: accessApi.readers,
    refetchInterval: options?.refetchInterval,
  });
}

export function useRfidCards(enabled = true, options?: QueryRefreshOptions) {
  return useQuery({
    queryKey: ["access", "cards"],
    queryFn: accessApi.cards,
    enabled,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreateRfidCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { uid: string; ownerName: string }) =>
      accessApi.createCard(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["access", "cards"] });
    },
  });
}

export function useAccessEvents(
  params: { from?: string; to?: string; limit?: number } = { limit: 20 },
  options?: QueryRefreshOptions,
) {
  return useQuery({
    queryKey: ["access", "events", params],
    queryFn: () => accessApi.events(params),
    refetchInterval: options?.refetchInterval,
  });
}
