"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { authApi } from "@/lib/api/smartguard-api";
import type { UserRole } from "@/lib/api/types";
import {
  clearAuthSession,
  getAuthSession,
  getAuthSessionKey,
  parseAuthSessionSnapshot,
  storeAuthSession,
  subscribeAuthSession,
} from "@/lib/auth/auth-storage";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const sessionSnapshot = useSyncExternalStore(
      subscribeAuthSession,
      getAuthSessionKey,
      () => "",
  );

  const session = parseAuthSessionSnapshot(sessionSnapshot);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (auth) => {
      storeAuthSession(auth);
      queryClient.clear();
    },
  });

  const logout = async () => {
    const current = getAuthSession();

    try {
      if (current?.refreshToken) {
        await authApi.logout(current.refreshToken);
      }
    } catch {
      // Aunque falle el logout en backend, limpiamos la sesión local.
    } finally {
      clearAuthSession();
      queryClient.clear();
      router.replace("/login");
    }
  };

  return {
    session,
    username: session?.username,
    role: session?.role as UserRole | undefined,
    isAuthenticated: Boolean(session?.accessToken),
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error,
    logout,
  };
}