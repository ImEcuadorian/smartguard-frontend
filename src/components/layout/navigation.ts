import {
  Bell,
  CircuitBoard,
  Gauge,
  LockKeyhole,
  RadioReceiver,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserCircle,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/lib/api/types";
import {
  ADMIN_ROLES,
  AUTHENTICATED_ROLES,
  OPERATION_ROLES,
  hasAnyRole,
} from "@/lib/auth/permissions";

type NavigationSection = "main" | "admin" | "account";

export interface NavigationItem {
  href: string;
  label: string;
  clientLabel?: string;
  icon: LucideIcon;
  section: NavigationSection;
  roles: readonly UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard",
    clientLabel: "Mi Dashboard",
    icon: Gauge,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/devices",
    label: "Dispositivos",
    clientLabel: "Mis Dispositivos",
    icon: CircuitBoard,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/sensors",
    label: "Sensores",
    clientLabel: "Mis Sensores",
    icon: RadioReceiver,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/access",
    label: "RFID / Accesos",
    clientLabel: "Mis Accesos",
    icon: LockKeyhole,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/actuators",
    label: "Actuadores",
    icon: SlidersHorizontal,
    section: "main",
    roles: OPERATION_ROLES,
  },
  {
    href: "/alerts",
    label: "Alertas",
    clientLabel: "Mis Alertas",
    icon: Bell,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/users",
    label: "Clientes / Usuarios",
    icon: UsersRound,
    section: "admin",
    roles: ADMIN_ROLES,
  },
  {
    href: "/settings",
    label: "Configuracion",
    clientLabel: "Perfil",
    icon: Settings,
    section: "account",
    roles: AUTHENTICATED_ROLES,
  },
];

export function getNavigationItems(role: UserRole | undefined) {
  return navigationItems
    .filter((item) => hasAnyRole(role, item.roles))
    .map((item) => ({
      ...item,
      label: role === "VIEWER" && item.clientLabel ? item.clientLabel : item.label,
    }));
}

export function getSectionLabel(section: NavigationSection) {
  const labels: Record<NavigationSection, string> = {
    main: "Operacion",
    admin: "Administracion",
    account: "Cuenta",
  };

  return labels[section];
}

export function getRouteTitle(pathname: string, role: UserRole | undefined) {
  if (pathname.startsWith("/devices/")) return "Detalle de dispositivo";
  if (pathname.startsWith("/sensors/")) return "Detalle de sensor";

  const item = getNavigationItems(role)
    .filter((navItem) => navItem.href !== "/")
    .find((navItem) => pathname === navItem.href || pathname.startsWith(`${navItem.href}/`));

  if (item) return item.label;
  if (pathname === "/") return role === "VIEWER" ? "Mi Dashboard" : "Dashboard";

  return "SmartGuard";
}

export const BrandIcon = ShieldCheck;
export const AccountIcon = UserCircle;
