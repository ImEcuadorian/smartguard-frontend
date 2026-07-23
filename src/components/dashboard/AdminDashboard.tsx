"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents, useAccessReaders } from "@/hooks/useAccessEvents";
import { useActuators } from "@/hooks/useActuators";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser, useUsers } from "@/hooks/useCurrentUser";
import { useDevices } from "@/hooks/useDevices";
import { useSensorReadings, useSensors } from "@/hooks/useSensors";
import { canManage, getRoleLabel } from "@/lib/auth/roles";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { buildActivityLog } from "@/lib/utils/activity-log";
import { buildAdminStats } from "@/lib/utils/dashboard-stats";
import type { TimeRangeId } from "@/lib/utils/time-range";
import { getRangeDescription, getTimeRangeWindow } from "@/lib/utils/time-range";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminActuatorsTab } from "./AdminActuatorsTab";
import { AdminAnalyticsTab } from "./AdminAnalyticsTab";
import { AdminDashboardTabs } from "./AdminDashboardTabs";
import type {
  AdminDashboardTabId,
  AdminDashboardTabProps,
} from "./AdminDashboardTabs";
import { AdminDevicesSensorsTab } from "./AdminDevicesSensorsTab";
import { AdminOverviewTab } from "./AdminOverviewTab";
import { AdminRfidTab } from "./AdminRfidTab";
import { AdminSecurityTab } from "./AdminSecurityTab";
import { AdminUsersTab } from "./AdminUsersTab";
import { AutoRefreshIndicator } from "./AutoRefreshIndicator";
import type { ModuleHealth } from "./SystemHealthCard";
import { TimeRangeFilter } from "./TimeRangeFilter";

const REFRESH_INTERVAL = 30_000;

export function AdminDashboard({
  initialTab = "overview",
}: {
  initialTab?: AdminDashboardTabId;
}) {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const [range, setRange] = useState<TimeRangeId>("24h");
  const [activeTab, setActiveTab] = useState<AdminDashboardTabId>(initialTab);
  const [manualUpdatedAt, setManualUpdatedAt] = useState(() => new Date());
  const isAdmin = canManage(role);
  const rangeParams = useMemo(() => {
    const window = getTimeRangeWindow(range);
    return { from: window.fromIso, limit: 80 };
  }, [range]);

  const currentUser = useCurrentUser(Boolean(session?.accessToken), {
    refetchInterval: REFRESH_INTERVAL,
  });
  const devices = useDevices(undefined, { refetchInterval: REFRESH_INTERVAL });
  const sensors = useSensors(undefined, { refetchInterval: REFRESH_INTERVAL });
  const alerts = useAlerts(undefined, { refetchInterval: REFRESH_INTERVAL });
  const accessEvents = useAccessEvents(rangeParams, {
    refetchInterval: REFRESH_INTERVAL,
  });
  const accessReaders = useAccessReaders({
    refetchInterval: REFRESH_INTERVAL,
  });
  const actuators = useActuators({ refetchInterval: REFRESH_INTERVAL });
  const users = useUsers(isAdmin, { refetchInterval: REFRESH_INTERVAL });

  const devicesData = devices.data ?? [];
  const sensorsData = sensors.data ?? [];
  const alertsData = alerts.data ?? [];
  const accessEventsData = accessEvents.data ?? [];
  const accessReadersData = accessReaders.data ?? [];
  const actuatorsData = actuators.data ?? [];
  const usersData = users.data ?? [];
  const chartSensor =
    sensorsData.find((sensor) => sensor.status === "ACTIVE") ?? sensorsData[0];
  const sensorReadings = useSensorReadings(
    chartSensor?.id,
    { from: rangeParams.from, limit: 30 },
    { refetchInterval: REFRESH_INTERVAL },
  );

  const stats = buildAdminStats({
    devices: devicesData,
    sensors: sensorsData,
    alerts: alertsData,
    accessEvents: accessEventsData,
    actuators: actuatorsData,
    users: usersData,
    range,
  });
  const activityItems = buildActivityLog({
    alerts: stats.alerts.visible,
    accessEvents: stats.access.visible,
    sensors: sensorsData,
  });
  const isFetching =
    devices.isFetching ||
    sensors.isFetching ||
    alerts.isFetching ||
    accessEvents.isFetching ||
    accessReaders.isFetching ||
    actuators.isFetching ||
    users.isFetching ||
    sensorReadings.isFetching;
  const updatedAt = useMemo(
    () =>
      new Date(
        Math.max(
          manualUpdatedAt.getTime(),
          currentUser.dataUpdatedAt,
          devices.dataUpdatedAt,
          sensors.dataUpdatedAt,
          alerts.dataUpdatedAt,
          accessEvents.dataUpdatedAt,
          accessReaders.dataUpdatedAt,
          actuators.dataUpdatedAt,
          users.dataUpdatedAt,
          sensorReadings.dataUpdatedAt,
        ),
      ),
    [
      accessEvents.dataUpdatedAt,
      accessReaders.dataUpdatedAt,
      actuators.dataUpdatedAt,
      alerts.dataUpdatedAt,
      currentUser.dataUpdatedAt,
      devices.dataUpdatedAt,
      manualUpdatedAt,
      sensorReadings.dataUpdatedAt,
      sensors.dataUpdatedAt,
      users.dataUpdatedAt,
    ],
  );

  useEffect(() => {
    if (!session?.accessToken) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: "/topic/alerts",
        onMessage: () => {
          void queryClient.invalidateQueries({ queryKey: ["alerts"] });
        },
      },
      {
        topic: "/topic/access/events",
        onMessage: () => {
          void queryClient.invalidateQueries({ queryKey: ["access", "events"] });
        },
      },
    ]);
  }, [queryClient, session?.accessToken]);

  function refreshDashboard() {
    setManualUpdatedAt(new Date());
    void queryClient.invalidateQueries({ queryKey: ["devices"] });
    void queryClient.invalidateQueries({ queryKey: ["sensors"] });
    void queryClient.invalidateQueries({ queryKey: ["alerts"] });
    void queryClient.invalidateQueries({ queryKey: ["access"] });
    void queryClient.invalidateQueries({ queryKey: ["actuators"] });
    void queryClient.invalidateQueries({ queryKey: ["users"] });
  }

  const modules: ModuleHealth[] = [
    {
      label: "Backend",
      detail: currentUser.isError
        ? "Sesion no verificada por backend"
        : "Autenticacion disponible",
      status: currentUser.isLoading
        ? "loading"
        : currentUser.isError
          ? "warning"
          : "online",
    },
    {
      label: "Dispositivos",
      detail: devices.isError
        ? "Modulo no disponible"
        : `${stats.devices.total} ESP32 registrados`,
      status: devices.isLoading ? "loading" : devices.isError ? "offline" : "online",
    },
    {
      label: "Sensores",
      detail: sensors.isError
        ? "Lecturas no disponibles"
        : `${stats.sensors.total} sensores configurados`,
      status: sensors.isLoading ? "loading" : sensors.isError ? "offline" : "online",
    },
    {
      label: "RFID",
      detail: accessEvents.isError
        ? "Puede requerir permisos del backend"
        : `${stats.access.total} eventos en el rango`,
      status: accessEvents.isLoading
        ? "loading"
        : accessEvents.isError
          ? "warning"
          : "online",
    },
  ];

  const states: AdminDashboardTabProps["states"] = {
    devices: {
      isLoading: devices.isLoading,
      isError: devices.isError,
    },
    sensors: {
      isLoading: sensors.isLoading,
      isError: sensors.isError,
    },
    alerts: {
      isLoading: alerts.isLoading,
      isError: alerts.isError,
    },
    accessEvents: {
      isLoading: accessEvents.isLoading,
      isError: accessEvents.isError,
    },
    accessReaders: {
      isLoading: accessReaders.isLoading,
      isError: accessReaders.isError,
    },
    actuators: {
      isLoading: actuators.isLoading,
      isError: actuators.isError,
    },
    users: {
      isLoading: users.isLoading,
      isError: users.isError,
    },
    sensorReadings: {
      isLoading: sensorReadings.isLoading,
      isError: sensorReadings.isError,
    },
  };

  const tabProps: AdminDashboardTabProps = {
    stats,
    modules,
    devicesData,
    sensorsData,
    actuatorsData,
    accessReadersData,
    usersData,
    activityItems,
    chartSensor,
    sensorReadingsData: sensorReadings.data ?? [],
    states,
    isAdmin,
    role,
    refreshInterval: REFRESH_INTERVAL,
  };

  function renderActiveTab() {
    if (activeTab === "devices-sensors") {
      return <AdminDevicesSensorsTab {...tabProps} />;
    }

    if (activeTab === "security") {
      return <AdminSecurityTab {...tabProps} />;
    }

    if (activeTab === "rfid") {
      return <AdminRfidTab {...tabProps} />;
    }

    if (activeTab === "actuators") {
      return <AdminActuatorsTab {...tabProps} />;
    }

    if (activeTab === "users" && isAdmin) {
      return <AdminUsersTab {...tabProps} />;
    }

    if (activeTab === "analytics" && isAdmin) {
      return <AdminAnalyticsTab {...tabProps} />;
    }

    return <AdminOverviewTab {...tabProps} />;
  }

  return (
    <>
      <PageHeader
        title={isAdmin ? "Dashboard administrador" : "Dashboard operativo"}
        description={`Consola global SmartGuard por dominios. ${getRangeDescription(range)}.`}
        actions={
          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap justify-end gap-2">
              <Badge className="border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
                {getRoleLabel(role)}
              </Badge>
              <Badge className="border-emerald-300/25 bg-emerald-400/10 text-emerald-100">
                Salud {stats.systemScore}%
              </Badge>
            </div>
            <AutoRefreshIndicator
              updatedAt={updatedAt}
              intervalSeconds={REFRESH_INTERVAL / 1000}
              isFetching={isFetching}
              onRefresh={refreshDashboard}
            />
          </div>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TimeRangeFilter value={range} onChange={setRange} />
        <p className="text-sm text-slate-500">
          Si un modulo no soporta rango en backend, se filtra con fechas disponibles.
        </p>
      </div>

      <div className="space-y-6">
        <AdminDashboardTabs
          activeTab={activeTab}
          isAdmin={isAdmin}
          onChange={setActiveTab}
        />
        {renderActiveTab()}
      </div>
    </>
  );
}
