"use client";

import {
  AlertTriangle,
  BarChart3,
  CircuitBoard,
  Fingerprint,
  Gauge,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  ActuatorResponse,
  AccessReaderResponse,
  DeviceResponse,
  SensorReadingResponse,
  SensorResponse,
  UserAccountResponse,
  UserRole,
} from "@/lib/api/types";
import type { ActivityLogItem } from "@/lib/utils/activity-log";
import type { buildAdminStats } from "@/lib/utils/dashboard-stats";
import { cn } from "@/lib/utils/cn";
import type { ModuleHealth } from "./SystemHealthCard";

export type AdminDashboardTabId =
  | "overview"
  | "devices-sensors"
  | "security"
  | "rfid"
  | "actuators"
  | "users"
  | "analytics";

export interface DashboardModuleState {
  isLoading: boolean;
  isError: boolean;
}

export interface AdminDashboardTabProps {
  stats: ReturnType<typeof buildAdminStats>;
  modules: ModuleHealth[];
  devicesData: DeviceResponse[];
  sensorsData: SensorResponse[];
  actuatorsData: ActuatorResponse[];
  accessReadersData: AccessReaderResponse[];
  usersData: UserAccountResponse[];
  activityItems: ActivityLogItem[];
  chartSensor?: SensorResponse;
  sensorReadingsData: SensorReadingResponse[];
  states: {
    devices: DashboardModuleState;
    sensors: DashboardModuleState;
    alerts: DashboardModuleState;
    accessEvents: DashboardModuleState;
    accessReaders: DashboardModuleState;
    actuators: DashboardModuleState;
    users: DashboardModuleState;
    sensorReadings: DashboardModuleState;
  };
  isAdmin: boolean;
  role?: UserRole;
  refreshInterval: number;
}

const tabs: Array<{
  id: AdminDashboardTabId;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "overview",
    label: "Resumen 360",
    description: "KPIs de cocina y salud",
    icon: Gauge,
  },
  {
    id: "devices-sensors",
    label: "Dispositivos",
    description: "ESP32, sensores y telemetria",
    icon: CircuitBoard,
  },
  {
    id: "security",
    label: "Seguridad",
    description: "Riesgos y alertas",
    icon: AlertTriangle,
  },
  {
    id: "rfid",
    label: "Accesos RFID",
    description: "Eventos y lectores",
    icon: Fingerprint,
  },
  {
    id: "actuators",
    label: "Actuadores",
    description: "Control y estado",
    icon: SlidersHorizontal,
  },
  {
    id: "users",
    label: "Clientes / usuarios",
    description: "Cuentas y roles",
    icon: UsersRound,
  },
  {
    id: "analytics",
    label: "Analitica 360",
    description: "Datos reales del sistema",
    icon: BarChart3,
  },
];

export function AdminDashboardTabs({
  activeTab,
  onChange,
  isAdmin = true,
}: {
  activeTab: AdminDashboardTabId;
  onChange: (tab: AdminDashboardTabId) => void;
  isAdmin?: boolean;
}) {
  const visibleTabs = isAdmin
    ? tabs
    : tabs
        .filter((tab) => !["users", "analytics"].includes(tab.id))
        .map((tab) =>
          tab.id === "overview"
            ? { ...tab, label: "Operacion", description: "Monitoreo 24 horas" }
            : tab.id === "security"
              ? { ...tab, label: "Alertas", description: "Riesgos abiertos" }
              : tab,
        );

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-2 backdrop-blur-2xl">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "animate-tab-fade group flex min-h-20 items-start gap-3 rounded-lg border p-3 text-left transition duration-300",
                active
                  ? "border-[rgb(var(--sg-primary-rgb)/0.45)] bg-[rgb(var(--sg-primary-rgb)/0.16)] text-slate-50 shadow-[var(--sg-glow)]"
                  : "border-white/8 bg-white/5 text-slate-300 hover:border-white/15 hover:bg-white/10",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                  active
                    ? "border-[rgb(var(--sg-primary-rgb)/0.45)] bg-[rgb(var(--sg-primary-rgb)/0.2)] text-[var(--sg-primary)]"
                    : "border-white/10 bg-slate-950/30 text-slate-400 group-hover:text-slate-100",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{tab.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
