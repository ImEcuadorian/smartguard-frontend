"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, userApi } from "@/lib/api/smartguard-api";
import type { UserRole, UserStatus, UUID } from "@/lib/api/types";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled,
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.list,
    enabled,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      username: string;
      password: string;
      displayName: string;
      role: UserRole;
    }) => userApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: UUID; status: UserStatus }) =>
      userApi.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
