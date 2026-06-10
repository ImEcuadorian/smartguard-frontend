import type { UserRole } from "@/lib/api/types";

const roleRank: Record<UserRole, number> = {
  VIEWER: 1,
  OPERATOR: 2,
  ADMIN: 3,
};

export function hasRole(role: UserRole | undefined, minimum: UserRole) {
  if (!role) return false;
  return roleRank[role] >= roleRank[minimum];
}

export function canManage(role: UserRole | undefined) {
  return role === "ADMIN";
}

export function canOperate(role: UserRole | undefined) {
  return hasRole(role, "OPERATOR");
}

export function isViewer(role: UserRole | undefined) {
  return role === "VIEWER";
}
