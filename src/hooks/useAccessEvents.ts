"use client";

import { useQuery } from "@tanstack/react-query";
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
