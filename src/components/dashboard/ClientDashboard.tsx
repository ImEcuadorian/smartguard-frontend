"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  CircuitBoard,
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
import { useSensorReadings, useSensors } from "@/hooks/useSensors";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { buildActivityLog } from "@/lib/utils/activity-log";
import {
  getAccessStats,
  getAlertStats,
  getDeviceStats,
  getSensorStats,
  getSystemScore,
} from "@/lib/utils/dashboard-stats";
import type { TimeRangeId } from "@/lib/utils/time-range";
import { getRangeDescription, getTimeRangeWindow } from "@/lib/utils/time-range";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityLog } from "./ActivityLog";
import { ActivityPanel } from "./ActivityPanel";
import { AutoRefreshIndicator } from "./AutoRefreshIndicator";
import { AlertsChart } from "./charts/AlertsChart";
import { RfidEventsChart } from "./charts/RfidEventsChart";
import { SensorReadingsChart } from "./charts/SensorReadingsChart";
import { DonutStat } from "./DonutStat";
import { MetricCard } from "./MetricCard";
import { QuickControlPanel } from "./QuickControlPanel";
import { RecentAccessEvents } from "./RecentAccessEvents";
import { RecentAlerts } from "./RecentAlerts";
import { SensorSummaryPanel } from "./SensorSummaryPanel";
import { StatsOverview } from "./StatsOverview";
import type { ModuleHealth } from "./SystemHealthCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { TimeRangeFilter } from "./TimeRangeFilter";

const REFRESH_INTERVAL = 30_000;

export function ClientDashboard() {
  const queryClient = useQueryClient();
  const { session, username } = useAuth();
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
  const chartSensor =
    sensorsData.find((sensor) => sensor.type === "TEMPERATURE") ??
    sensorsData.find((sensor) => sensor.status === "ACTIVE") ??
    sensorsData[0];
  const sensorReadings = useSensorReadings(
    chartSensor?.id,
    { from: rangeParams.from, limit: 24 },
    { refetchInterval: REFRESH_INTERVAL },
  );

  const deviceStats = getDeviceStats(devicesData);
  const sensorStats = getSensorStats(sensorsData);
  const alertStats = getAlertStats(alertsData, range);
  const accessStats = getAccessStats(accessEventsData, range);
  const systemScore = getSystemScore({
    activeDevices: deviceStats.active,
    totalDevices: deviceStats.total,
    activeSensors: sensorStats.active,
    totalSensors: sensorStats.total,
    criticalAlerts: alertStats.critical,
  });
  const activityItems = buildActivityLog({
    alerts: alertStats.visible,
    accessEvents: accessStats.visible,
    sensors: sensorsData,
  });
  const securityState =
    alertStats.critical > 0
      ? {
          title: "Alerta critica",
          description: "Hay eventos criticos abiertos. Revisa alertas y sensores.",
          tone: "border-red-300/30 bg-red-500/10 text-red-100",
          icon: ShieldAlert,
        }
      : alertStats.open > 0
        ? {
            title: "Atencion requerida",
            description: "Existen alertas abiertas que requieren seguimiento.",
            tone: "border-amber-300/30 bg-amber-400/10 text-amber-100",
            icon: AlertTriangle,
          }
        : {
            title: "Sistema seguro",
            description: "No hay alertas abiertas en el rango seleccionado.",
            tone: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
            icon: ShieldCheck,
          };
  const SecurityIcon = securityState.icon;
  const isFetching =
    devices.isFetching ||
    sensors.isFetching ||
    alerts.isFetching ||
    accessEvents.isFetching ||
    actuators.isFetching ||
    sensorReadings.isFetching;
  const updatedAt = useMemo(
    () =>
      new Date(
        Math.max(
          manualUpdatedAt.getTime(),
          devices.dataUpdatedAt,
          sensors.dataUpdatedAt,
          alerts.dataUpdatedAt,
          accessEvents.dataUpdatedAt,
          actuators.dataUpdatedAt,
          sensorReadings.dataUpdatedAt,
        ),
      ),
    [
      accessEvents.dataUpdatedAt,
      actuators.dataUpdatedAt,
      alerts.dataUpdatedAt,
      devices.dataUpdatedAt,
      manualUpdatedAt,
      sensorReadings.dataUpdatedAt,
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
        : `${deviceStats.total} disponibles`,
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
        title="Mi Dashboard"
        description={`Vista operativa de seguridad. ${getRangeDescription(range)}.`}
        actions={
          <div className="flex flex-col gap-3 xl:items-end">
            <Badge className="w-fit border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
              CLIENTE
            </Badge>
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
          Vista sin administracion global ni gestion de usuarios.
        </p>
      </div>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className={securityState.tone}>
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-current/25 bg-current/10">
                  <SecurityIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-normal opacity-75">
                    Estado de seguridad
                  </p>
                  <h2 className="text-2xl font-semibold">{securityState.title}</h2>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 opacity-85">
                {securityState.description}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-5xl font-semibold">{systemScore}%</p>
              <p className="mt-1 text-sm opacity-75">salud del sistema</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-400">Bienvenido</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-50">
              {currentUser.data?.displayName ?? username ?? "Cliente SmartGuard"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Si el backend aun no separa datos por cliente, se muestran datos
              disponibles sin exponer acciones administrativas.
            </p>
          </CardContent>
        </Card>
      </section>

      <StatsOverview>
        <MetricCard
          title="Mis dispositivos"
          value={deviceStats.total}
          description={`${deviceStats.active} funcionando correctamente`}
          icon={CircuitBoard}
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Sensores activos"
          value={sensorStats.active}
          description={`${sensorStats.total} sensores asociados`}
          icon={RadioReceiver}
          tone="sky"
          isLoading={sensors.isLoading}
          hasError={sensors.isError}
        />
        <MetricCard
          title="Alertas abiertas"
          value={alertStats.open}
          description={`${alertStats.critical} criticas`}
          icon={AlertTriangle}
          tone={alertStats.critical > 0 ? "red" : "emerald"}
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title="Ultimo RFID"
          value={accessStats.visible[0]?.result ?? "N/A"}
          description={accessStats.visible[0]?.cardUid ?? "Sin eventos recientes"}
          icon={Fingerprint}
          tone={accessStats.visible[0]?.result === "DENIED" ? "red" : "amber"}
          isLoading={accessEvents.isLoading}
          hasError={accessEvents.isError}
        />
      </StatsOverview>

      <section className="mt-6 grid gap-6 xl:grid-cols-4">
        <DonutStat
          title="Sistema protegido"
          value={systemScore}
          total={100}
          label="Salud operativa"
          icon={ShieldCheck}
        />
        <DonutStat
          title="Dispositivos activos"
          value={deviceStats.active}
          total={deviceStats.total}
          label="Equipos en linea"
          icon={CircuitBoard}
          tone="rgb(52 211 153)"
        />
        <DonutStat
          title="Sensores activos"
          value={sensorStats.active}
          total={sensorStats.total}
          label="Telemetria disponible"
          icon={RadioReceiver}
          tone="rgb(56 189 248)"
        />
        <DonutStat
          title="Accesos concedidos"
          value={accessStats.granted}
          total={Math.max(accessStats.total, accessStats.granted)}
          label="RFID reciente"
          icon={Fingerprint}
          tone="rgb(52 211 153)"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SystemHealthCard modules={modules} />
        <ActivityPanel
          title="Sensores importantes"
          description="Puerta, movimiento, gas, emergencia y lecturas ambientales."
          icon={DoorClosed}
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores" />
          ) : sensors.isError ? (
            <ErrorState
              tone="warning"
              title="Sensores no disponibles"
              description="No se pudo cargar sensores. El dashboard permanece estable."
            />
          ) : (
            <SensorSummaryPanel
              sensors={sensorsData}
              limit={8}
              refetchInterval={REFRESH_INTERVAL}
            />
          )}
        </ActivityPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Ultimas lecturas importantes"
          description="Tendencia del sensor numerico disponible."
          icon={RadioReceiver}
        >
          {sensorReadings.isLoading ? (
            <LoadingState label="Cargando lecturas" />
          ) : sensorReadings.isError ? (
            <ErrorState
              tone="info"
              title="Lecturas no disponibles"
              description="No hay historico suficiente o el endpoint no respondio."
            />
          ) : (
            <SensorReadingsChart
              sensor={chartSensor}
              readings={sensorReadings.data ?? []}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Alertas por dia"
          description="Resumen de severidad en el rango seleccionado."
          icon={Bell}
        >
          {alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : alerts.isError ? (
            <ErrorState tone="warning" title="Alertas no disponibles" />
          ) : (
            <AlertsChart
              critical={alertStats.critical}
              warning={alertStats.warning}
              info={alertStats.info}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Bitacora reciente"
          description="Alertas, accesos RFID y cambios relevantes."
          icon={Activity}
        >
          <ActivityLog items={activityItems} limit={10} />
        </ActivityPanel>
        <ActivityPanel
          title="Mis accesos recientes"
          description="Eventos permitidos y denegados visibles para tu cuenta."
          icon={Fingerprint}
        >
          {accessEvents.isLoading ? (
            <LoadingState label="Cargando accesos" />
          ) : accessEvents.isError ? (
            <ErrorState
              tone="info"
              title="Accesos no disponibles"
              description="El modulo RFID puede estar limitado por permisos del backend."
            />
          ) : (
            <RecentAccessEvents events={accessStats.visible} />
          )}
        </ActivityPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ActivityPanel
          title="Mis alertas recientes"
          description="Alertas abiertas o historicas del rango seleccionado."
          icon={AlertTriangle}
        >
          {alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : alerts.isError ? (
            <ErrorState
              tone="warning"
              title="Alertas no disponibles"
              description="No se pudo cargar el modulo de alertas."
            />
          ) : (
            <RecentAlerts alerts={alertStats.visible} />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Control rapido"
          description="Alarma, buzzer, cerradura, rele o LED disponibles."
          icon={SlidersHorizontal}
        >
          <QuickControlPanel
            actuators={actuatorsData}
            isLoading={actuators.isLoading}
            isError={actuators.isError}
          />
        </ActivityPanel>
      </section>

      <section className="mt-6">
        <ActivityPanel
          title="Actividad RFID"
          description="Tendencia reciente de accesos concedidos y denegados."
          icon={Fingerprint}
        >
          {accessEvents.isLoading ? (
            <LoadingState label="Cargando RFID" />
          ) : accessEvents.isError ? (
            <ErrorState tone="info" title="RFID no disponible" />
          ) : (
            <RfidEventsChart events={accessStats.visible} />
          )}
        </ActivityPanel>
      </section>
    </>
  );
}
