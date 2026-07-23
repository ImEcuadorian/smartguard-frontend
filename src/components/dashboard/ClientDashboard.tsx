"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  DoorClosed,
  Fingerprint,
  RadioReceiver,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents } from "@/hooks/useAccessEvents";
import { useActuators } from "@/hooks/useActuators";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDevices } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { buildActivityLog } from "@/lib/utils/activity-log";
import { buildAdminStats } from "@/lib/utils/dashboard-stats";
import { getAccessResultLabel } from "@/lib/utils/labels";
import type { TimeRangeId } from "@/lib/utils/time-range";
import { getRangeDescription, getTimeRangeWindow } from "@/lib/utils/time-range";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ActivityPanel } from "./ActivityPanel";
import { AboutUsPanel } from "./AboutUsPanel";
import { ClientActivityLog } from "./ClientActivityLog";
import { ClientQuickControls } from "./ClientQuickControls";
import { ClientSecurityStatus } from "./ClientSecurityStatus";
import { ClientSensorCards } from "./ClientSensorCards";
import { DeviceStatsPanel } from "./DeviceStatsPanel";
import { KitchenStatusPanel } from "./KitchenStatusPanel";
import { RecentAlerts } from "./RecentAlerts";
import type { ModuleHealth } from "./SystemHealthCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { TimeRangeFilter } from "./TimeRangeFilter";

const REFRESH_INTERVAL = 30_000;

export function ClientDashboard() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [range, setRange] = useState<TimeRangeId>("24h");
  const [manualUpdatedAt, setManualUpdatedAt] = useState(() => new Date());
  const rangeParams = useMemo(() => {
    const window = getTimeRangeWindow(range);
    return { from: window.fromIso, limit: 50 };
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
  const actuators = useActuators({ refetchInterval: REFRESH_INTERVAL });

  const devicesData = devices.data ?? [];
  const sensorsData = sensors.data ?? [];
  const alertsData = alerts.data ?? [];
  const accessEventsData = accessEvents.data ?? [];
  const actuatorsData = actuators.data ?? [];
  const dashboardStats = buildAdminStats({
    devices: devicesData,
    sensors: sensorsData,
    alerts: alertsData,
    accessEvents: accessEventsData,
    actuators: actuatorsData,
    users: [],
    range,
  });
  const deviceStats = dashboardStats.devices;
  const sensorStats = dashboardStats.sensors;
  const alertStats = dashboardStats.alerts;
  const accessStats = dashboardStats.access;
  const systemScore = dashboardStats.systemScore;
  const activityItems = buildActivityLog({
    alerts: alertStats.visible,
    accessEvents: accessStats.visible,
    sensors: sensorsData,
  });
  const securityState =
    dashboardStats.kitchen.tone === "critical"
      ? {
          title: "Alerta critica en cocina",
          description: "Existe una alerta critica activa o un riesgo sensible de gas, emergencia o seguridad.",
          tone: "border-red-300/30 bg-red-500/10 text-red-100",
          icon: ShieldAlert,
        }
      : dashboardStats.kitchen.tone === "warning"
        ? {
            title: "Revision recomendada",
            description: "Hay sensores o alertas que conviene revisar antes de continuar la operacion.",
            tone: "border-amber-300/30 bg-amber-400/10 text-amber-100",
            icon: AlertTriangle,
          }
        : {
            title: "Cocina segura",
            description: "Todo esta funcionando correctamente segun los datos disponibles del sistema.",
            tone: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
            icon: ShieldCheck,
          };
  const isFetching =
    devices.isFetching ||
    sensors.isFetching ||
    alerts.isFetching ||
    accessEvents.isFetching ||
    actuators.isFetching;
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
          actuators.dataUpdatedAt,
        ),
      ),
    [
      accessEvents.dataUpdatedAt,
      actuators.dataUpdatedAt,
      alerts.dataUpdatedAt,
      currentUser.dataUpdatedAt,
      devices.dataUpdatedAt,
      manualUpdatedAt,
      sensors.dataUpdatedAt,
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
  }

  const modules: ModuleHealth[] = [
    {
      label: "Cuenta",
      detail: currentUser.isError ? "Perfil no verificado" : "Sesion cliente activa",
      status: currentUser.isLoading
        ? "loading"
        : currentUser.isError
          ? "warning"
          : "online",
    },
    {
      label: "Dispositivos",
      detail: devices.isError
        ? "No se pudieron cargar tus dispositivos"
        : `${deviceStats.active} de ${deviceStats.total} activos`,
      status: devices.isLoading ? "loading" : devices.isError ? "warning" : "online",
    },
    {
      label: "Sensores",
      detail: sensors.isError
        ? "Sensores no disponibles"
        : `${sensorStats.active} sensores activos`,
      status: sensors.isLoading ? "loading" : sensors.isError ? "warning" : "online",
    },
    {
      label: "Alertas",
      detail: alerts.isError
        ? "Alertas no disponibles"
        : `${alertStats.open} alertas abiertas`,
      status: alerts.isLoading ? "loading" : alerts.isError ? "warning" : "online",
    },
  ];

  return (
    <>
      <PageHeader
        title="Mi cocina"
        description={`Vista simple de seguridad y operacion SmartGuard 360. ${getRangeDescription(range)}.`}
        actions={
          <Badge className="w-fit border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
            CLIENTE
          </Badge>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TimeRangeFilter value={range} onChange={setRange} />
        <p className="text-sm text-slate-500">
          Vista enfocada en cocina, alertas importantes y control rapido.
        </p>
      </div>

      <div className="space-y-6">
        <ClientSecurityStatus
          title={securityState.title}
          description={securityState.description}
          tone={securityState.tone}
          icon={securityState.icon}
          systemScore={systemScore}
          updatedAt={updatedAt}
          isFetching={isFetching}
          onRefresh={refreshDashboard}
        />

        <KitchenStatusPanel kitchen={dashboardStats.kitchen} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <DoorClosed className="h-5 w-5 text-[var(--sg-primary)]" />
                <div>
                  <p className="text-xs uppercase tracking-normal text-slate-500">
                    Estado de alarma
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {dashboardStats.kitchen.emergency || alertStats.critical > 0
                      ? "Activa por alerta"
                      : "Sin alarma critica"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <RadioReceiver className="h-5 w-5 text-sky-300" />
                <div>
                  <p className="text-xs uppercase tracking-normal text-slate-500">
                    Estado de puerta
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {dashboardStats.kitchen.doorOpen ? "Abierta" : "Sin alerta"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-amber-200" />
                <div>
                  <p className="text-xs uppercase tracking-normal text-slate-500">
                    Gas / humo
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {dashboardStats.kitchen.gasRisk ? "Riesgo" : "Normal"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-emerald-200" />
                <div>
                  <p className="text-xs uppercase tracking-normal text-slate-500">
                    Ultimo acceso
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">
                    {accessStats.visible[0]
                      ? getAccessResultLabel(accessStats.visible[0].result)
                      : "Sin eventos"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ActivityPanel
            title="Control rapido"
            description="Acciones disponibles para alarma, buzzer, cerradura, rele o LED."
            icon={SlidersHorizontal}
          >
            <ClientQuickControls
              actuators={actuatorsData}
              isLoading={actuators.isLoading}
              isError={actuators.isError}
            />
          </ActivityPanel>
          <SystemHealthCard modules={modules} />
        </section>

        <ActivityPanel
          title="Sensores principales"
          description="Puerta, movimiento, gas, emergencia y lecturas ambientales interpretadas visualmente."
          icon={RadioReceiver}
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores" />
          ) : sensors.isError ? (
            <ErrorState
              tone="warning"
              title="Sensores no disponibles"
              description="No se pudo cargar sensores. El resto de la consola permanece disponible."
            />
          ) : (
            <ClientSensorCards
              sensors={sensorsData}
              refetchInterval={REFRESH_INTERVAL}
            />
          )}
        </ActivityPanel>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ActivityPanel
            title="Bitacora reciente"
            description="RFID, alertas y cambios relevantes de sensores."
            icon={Activity}
          >
            <ClientActivityLog items={activityItems} />
          </ActivityPanel>
          <ActivityPanel
            title="Mis alertas"
            description="Alertas visibles para operacion del sistema."
            icon={AlertTriangle}
          >
            {alerts.isLoading ? (
              <LoadingState label="Cargando alertas" />
            ) : alerts.isError ? (
              <ErrorState
                tone="warning"
                title="Alertas no disponibles"
                description="No se pudo consultar el modulo de alertas."
              />
            ) : (
              <RecentAlerts alerts={alertStats.visible} />
            )}
          </ActivityPanel>
        </section>

        <section>
          <SectionHeader
            title="Mis dispositivos"
            description="Estado, ubicacion y ultima conexion de equipos disponibles."
          />
          {devices.isLoading ? (
            <LoadingState label="Cargando dispositivos" />
          ) : devices.isError ? (
            <ErrorState
              tone="warning"
              title="Dispositivos no disponibles"
              description="No se pudo consultar dispositivos."
            />
          ) : devicesData.length ? (
            <DeviceStatsPanel
              devices={devicesData}
              sensors={sensorsData}
              actuators={actuatorsData}
              alerts={alertStats.visible}
              clientMode
            />
          ) : (
            <EmptyState
              title="Sin dispositivos"
              description="No hay dispositivos asociados para mostrar."
            />
          )}
        </section>

        <AboutUsPanel />
      </div>
    </>
  );
}
