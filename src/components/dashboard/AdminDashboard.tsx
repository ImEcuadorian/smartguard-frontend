"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Fingerprint,
  RadioReceiver,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents } from "@/hooks/useAccessEvents";
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
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityLog } from "./ActivityLog";
import { ActivityPanel } from "./ActivityPanel";
import { AutoRefreshIndicator } from "./AutoRefreshIndicator";
import { AlertsChart } from "./charts/AlertsChart";
import { DeviceStatusChart } from "./charts/DeviceStatusChart";
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

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const [range, setRange] = useState<TimeRangeId>("24h");
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
  const actuators = useActuators({ refetchInterval: REFRESH_INTERVAL });
  const users = useUsers(isAdmin, { refetchInterval: REFRESH_INTERVAL });

  const devicesData = devices.data ?? [];
  const sensorsData = sensors.data ?? [];
  const alertsData = alerts.data ?? [];
  const accessEventsData = accessEvents.data ?? [];
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
    actuators.isFetching ||
    users.isFetching ||
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
          users.dataUpdatedAt,
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
      users.dataUpdatedAt,
    ],
  );
  const coreError = devices.isError || sensors.isError || alerts.isError;

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

  return (
    <>
      <PageHeader
        title={isAdmin ? "Dashboard administrador" : "Dashboard operativo"}
        description={`Vision global del sistema SmartGuard. ${getRangeDescription(range)}.`}
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
          Si el backend no expone rango en un modulo, el filtro se aplica en frontend
          con las fechas disponibles.
        </p>
      </div>

      {coreError ? (
        <div className="mb-5">
          <ErrorState
            tone="warning"
            title="Algunos modulos no respondieron"
            description="El dashboard muestra la informacion disponible sin bloquear el resto de la pantalla."
          />
        </div>
      ) : null}

      <StatsOverview>
        <MetricCard
          title="Dispositivos totales"
          value={stats.devices.total}
          description={`${stats.devices.active} activos en linea`}
          icon={CircuitBoard}
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Dispositivos activos"
          value={stats.devices.active}
          description="ESP32 operativos"
          icon={CheckCircle2}
          tone="emerald"
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Dispositivos inactivos"
          value={stats.devices.inactive}
          description="Sin actividad operativa"
          icon={XCircle}
          tone="slate"
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="En mantenimiento"
          value={stats.devices.maintenance}
          description="Dispositivos fuera de servicio"
          icon={Wrench}
          tone="amber"
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Sensores totales"
          value={stats.sensors.total}
          description={`${stats.sensors.active} sensores activos`}
          icon={RadioReceiver}
          tone="sky"
          isLoading={sensors.isLoading}
          hasError={sensors.isError}
        />
        <MetricCard
          title="Sensores inactivos"
          value={stats.sensors.inactive}
          description={`${stats.sensors.maintenance} en mantenimiento`}
          icon={RadioReceiver}
          tone="slate"
          isLoading={sensors.isLoading}
          hasError={sensors.isError}
        />
        <MetricCard
          title="Alertas abiertas"
          value={stats.alerts.open}
          description={`${stats.alerts.critical} criticas en el rango`}
          icon={AlertTriangle}
          tone={stats.alerts.critical > 0 ? "red" : "emerald"}
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title="Alertas reconocidas"
          value={stats.alerts.acknowledged}
          description={`${stats.alerts.resolved} resueltas`}
          icon={Bell}
          tone="amber"
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title="Eventos RFID"
          value={stats.access.total}
          description={`${stats.access.granted} concedidos, ${stats.access.denied} denegados`}
          icon={Fingerprint}
          tone="primary"
          isLoading={accessEvents.isLoading}
          hasError={accessEvents.isError}
        />
        <MetricCard
          title="Accesos concedidos"
          value={stats.access.granted}
          description="RFID autorizado"
          icon={ShieldCheck}
          tone="emerald"
          isLoading={accessEvents.isLoading}
          hasError={accessEvents.isError}
        />
        <MetricCard
          title="Actuadores"
          value={stats.actuators.total}
          description={`${stats.actuators.active} disponibles para operacion`}
          icon={SlidersHorizontal}
          tone="amber"
          isLoading={actuators.isLoading}
          hasError={actuators.isError}
        />
        <MetricCard
          title={isAdmin ? "Usuarios registrados" : "Modo operador"}
          value={isAdmin ? stats.users.total : "Limitado"}
          description={isAdmin ? `${stats.users.active} cuentas activas` : "Sin administracion de usuarios"}
          icon={isAdmin ? UsersRound : Activity}
          tone="slate"
          isLoading={isAdmin ? users.isLoading : false}
          hasError={isAdmin ? users.isError : false}
        />
      </StatsOverview>

      <section className="mt-6 grid gap-6 xl:grid-cols-4">
        <DonutStat
          title="Estado general"
          value={stats.systemScore}
          total={100}
          label="Salud operativa calculada"
          icon={ShieldCheck}
        />
        <DonutStat
          title="Dispositivos activos"
          value={stats.devices.active}
          total={stats.devices.total}
          label="ESP32 activos"
          icon={Cpu}
        />
        <DonutStat
          title="Sensores activos"
          value={stats.sensors.active}
          total={stats.sensors.total}
          label="Telemetria disponible"
          icon={RadioReceiver}
          tone="rgb(56 189 248)"
        />
        <DonutStat
          title="Accesos concedidos"
          value={stats.access.granted}
          total={Math.max(stats.access.total, stats.access.granted)}
          label="RFID en el rango"
          icon={Fingerprint}
          tone="rgb(52 211 153)"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SystemHealthCard modules={modules} />
        <ActivityPanel
          title="Salud por modulo"
          description="Distribucion operativa de dispositivos y sensores."
          icon={ShieldCheck}
        >
          <div className="space-y-4">
            <DeviceStatusChart
              title="Dispositivos por estado"
              items={[
                { label: "Activos", value: stats.devices.active, color: "bg-emerald-400" },
                { label: "Inactivos", value: stats.devices.inactive, color: "bg-slate-500" },
                { label: "Mantenimiento", value: stats.devices.maintenance, color: "bg-amber-400" },
              ]}
            />
            <DeviceStatusChart
              title="Sensores por estado"
              items={[
                { label: "Activos", value: stats.sensors.active, color: "bg-sky-400" },
                { label: "Inactivos", value: stats.sensors.inactive, color: "bg-slate-500" },
                { label: "Mantenimiento", value: stats.sensors.maintenance, color: "bg-amber-400" },
              ]}
            />
          </div>
        </ActivityPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Lecturas por sensor"
          description="Tendencia numerica reciente del sensor activo seleccionado automaticamente."
          icon={RadioReceiver}
        >
          {sensorReadings.isLoading ? (
            <LoadingState label="Cargando lecturas" />
          ) : sensorReadings.isError ? (
            <ErrorState
              tone="info"
              title="Lecturas no disponibles"
              description="No se pudo cargar el historico del sensor para graficar."
            />
          ) : (
            <SensorReadingsChart
              sensor={chartSensor}
              readings={sensorReadings.data ?? []}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Alertas por severidad"
          description="Resumen visual de riesgo para el rango seleccionado."
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
            <AlertsChart
              critical={stats.alerts.critical}
              warning={stats.alerts.warning}
              info={stats.alerts.info}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Actividad RFID"
          description="Eventos concedidos y denegados por hora."
          icon={Fingerprint}
        >
          {accessEvents.isLoading ? (
            <LoadingState label="Cargando RFID" />
          ) : accessEvents.isError ? (
            <ErrorState
              tone="info"
              title="RFID no disponible"
              description="El modulo RFID puede estar limitado por permisos del backend."
            />
          ) : (
            <RfidEventsChart events={stats.access.visible} />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Eventos RFID recientes"
          description="Ultimos accesos permitidos y rechazados."
          icon={Fingerprint}
        >
          {accessEvents.isLoading ? (
            <LoadingState label="Cargando eventos" />
          ) : accessEvents.isError ? (
            <ErrorState tone="info" title="Eventos RFID no disponibles" />
          ) : (
            <RecentAccessEvents events={stats.access.visible} />
          )}
        </ActivityPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ActivityPanel
          title="Sensores importantes"
          description="Interpretacion visual de puerta, movimiento, gas, emergencia y sensores numericos."
          icon={RadioReceiver}
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores" />
          ) : sensors.isError ? (
            <ErrorState tone="warning" title="Sensores no disponibles" />
          ) : (
            <SensorSummaryPanel
              sensors={sensorsData}
              limit={8}
              refetchInterval={REFRESH_INTERVAL}
            />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Bitacora operativa"
          description="Alertas, accesos RFID y actividad reciente."
          icon={Activity}
        >
          <ActivityLog items={activityItems} />
        </ActivityPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ActivityPanel
          title="Alertas recientes"
          description="Eventos que requieren seguimiento operativo."
          icon={Bell}
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
            <RecentAlerts alerts={stats.alerts.visible} />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Control rapido"
          description="Acciones sobre actuadores registrados sin inventar comandos."
          icon={SlidersHorizontal}
        >
          <QuickControlPanel
            actuators={actuatorsData}
            isLoading={actuators.isLoading}
            isError={actuators.isError}
          />
        </ActivityPanel>
      </section>
    </>
  );
}
