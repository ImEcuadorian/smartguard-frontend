"use client";

import { useQuery } from "@tanstack/react-query";
import { accessApi } from "@/lib/api/smartguard-api";

export function useAccessReaders() {
  return useQuery({
    queryKey: ["access", "readers"],
    queryFn: accessApi.readers,
  });
}

export function useAccessEvents(
  params: { from?: string; to?: string; limit?: number } = { limit: 20 },
) {
  return useQuery({
    queryKey: ["access", "events", params],
    queryFn: () => accessApi.events(params),
  });
}
