import {
  Bell,
  BarChart3,
  CircuitBoard,
  Gauge,
  Info,
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

type NavigationSection = "main" | "admin" | "info" | "account";

export interface NavigationItem {
  href: string;
  label: string;
  clientLabel?: string;
  operatorLabel?: string;
  icon: LucideIcon;
  section: NavigationSection;
  roles: readonly UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard 360",
    clientLabel: "Mi cocina",
    operatorLabel: "Dashboard operativo",
    icon: Gauge,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/devices",
    label: "Dispositivos",
    clientLabel: "Mis dispositivos",
    icon: CircuitBoard,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/sensors",
    label: "Sensores",
    clientLabel: "Sensores",
    icon: RadioReceiver,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/access",
    label: "RFID / Accesos",
    clientLabel: "Bitacora",
    icon: LockKeyhole,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/actuators",
    label: "Actuadores",
    clientLabel: "Control",
    icon: SlidersHorizontal,
    section: "main",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/alerts",
    label: "Alertas",
    clientLabel: "Alertas",
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
    href: "/analytics",
    label: "Analitica",
    icon: BarChart3,
    section: "admin",
    roles: ADMIN_ROLES,
  },
  {
    href: "/about",
    label: "Acerca de nosotros",
    icon: Info,
    section: "info",
    roles: AUTHENTICATED_ROLES,
  },
  {
    href: "/profile",
    label: "Mi perfil",
    icon: UserCircle,
    section: "account",
    roles: ["VIEWER"],
  },
  {
    href: "/settings",
    label: "Configuracion",
    icon: Settings,
    section: "account",
    roles: OPERATION_ROLES,
  },
];

export function getNavigationItems(role: UserRole | undefined) {
  const items = navigationItems
    .filter((item) => hasAnyRole(role, item.roles))
    .map((item) => ({
      ...item,
      label:
        role === "VIEWER" && item.clientLabel
          ? item.clientLabel
          : role === "OPERATOR" && item.operatorLabel
            ? item.operatorLabel
            : item.label,
    }));

  if (role !== "VIEWER") return items;

  const viewerOrder = new Map([
    ["/", 0],
    ["/devices", 1],
    ["/sensors", 2],
    ["/alerts", 3],
    ["/access", 4],
    ["/actuators", 5],
    ["/about", 6],
    ["/profile", 7],
  ]);

  return [...items].sort(
    (a, b) => (viewerOrder.get(a.href) ?? 99) - (viewerOrder.get(b.href) ?? 99),
  );
}

export function getSectionLabel(section: NavigationSection) {
  const labels: Record<NavigationSection, string> = {
    main: "Operacion",
    admin: "Administracion",
    info: "Informacion",
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
  if (pathname === "/") {
    if (role === "VIEWER") return "Mi cocina";
    if (role === "OPERATOR") return "Dashboard operativo";
    return "Dashboard 360";
  }

  return "SmartGuard 360";
}

export const BrandIcon = ShieldCheck;
export const AccountIcon = UserCircle;
