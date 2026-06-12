import type { UserRole } from "@/lib/api/types";

export const ADMIN_ROLES: UserRole[] = ["ADMIN"];
export const OPERATION_ROLES: UserRole[] = ["ADMIN", "OPERATOR"];
export const AUTHENTICATED_ROLES: UserRole[] = ["ADMIN", "OPERATOR", "VIEWER"];

export function hasAnyRole(
  role: UserRole | undefined,
  allowedRoles: readonly UserRole[],
) {
  return Boolean(role && allowedRoles.includes(role));
}

export function canAccessAdmin(role: UserRole | undefined) {
  return hasAnyRole(role, ADMIN_ROLES);
}

export function canAccessOperations(role: UserRole | undefined) {
  return hasAnyRole(role, OPERATION_ROLES);
}

export function canAccessClientArea(role: UserRole | undefined) {
  return hasAnyRole(role, AUTHENTICATED_ROLES);
}

export function routeIsAllowed(
  role: UserRole | undefined,
  allowedRoles: readonly UserRole[],
) {
  return hasAnyRole(role, allowedRoles);
}
