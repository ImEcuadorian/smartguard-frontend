"use client";

import type { ReactNode } from "react";
import type { UserRole } from "@/lib/api/types";
import { routeIsAllowed } from "@/lib/auth/permissions";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/LoadingState";
import { AccessRestricted } from "./AccessRestricted";

export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoadingState label="Verificando sesion" />;
  }

  if (!routeIsAllowed(role, allowedRoles)) {
    return fallback ?? <AccessRestricted />;
  }

  return <>{children}</>;
}
