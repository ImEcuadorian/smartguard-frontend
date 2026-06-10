import type { AuthResponse, UserRole } from "@/lib/api/types";

export const AUTH_KEYS = {
  accessToken: "smartguard.accessToken",
  refreshToken: "smartguard.refreshToken",
  username: "smartguard.username",
  role: "smartguard.role",
} as const;

const AUTH_EVENT = "smartguard-auth-change";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: UserRole;
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAuthSession(): AuthSession | null {
  if (!canUseStorage()) return null;

  const accessToken = window.localStorage.getItem(AUTH_KEYS.accessToken);
  const refreshToken = window.localStorage.getItem(AUTH_KEYS.refreshToken);
  const username = window.localStorage.getItem(AUTH_KEYS.username);
  const role = window.localStorage.getItem(AUTH_KEYS.role) as UserRole | null;

  if (!accessToken || !refreshToken || !username || !role) return null;

  return { accessToken, refreshToken, username, role };
}

export function getAuthSessionKey() {
  if (!canUseStorage()) return "";

  const session = getAuthSession();

  return session ? JSON.stringify(session) : "";
}

export function parseAuthSessionSnapshot(snapshot: string): AuthSession | null {
  if (!snapshot) return null;

  try {
    return JSON.parse(snapshot) as AuthSession;
  } catch {
    return null;
  }
}

export function subscribeAuthSession(listener: () => void) {
  if (!canUseStorage()) return () => undefined;

  window.addEventListener("storage", listener);
  window.addEventListener(AUTH_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(AUTH_EVENT, listener);
  };
}

function emitAuthChange() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function storeAuthSession(auth: AuthResponse) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(AUTH_KEYS.accessToken, auth.accessToken);
  window.localStorage.setItem(AUTH_KEYS.refreshToken, auth.refreshToken);
  window.localStorage.setItem(AUTH_KEYS.username, auth.username);
  window.localStorage.setItem(AUTH_KEYS.role, auth.role);
  emitAuthChange();
}

export function clearAuthSession() {
  if (!canUseStorage()) return;

  Object.values(AUTH_KEYS).forEach((key) => window.localStorage.removeItem(key));
  emitAuthChange();
}
