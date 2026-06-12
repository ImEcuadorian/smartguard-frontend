"use client";

import {
  AlertTriangle,
  CircuitBoard,
  Fingerprint,
  RadioReceiver,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents } from "@/hooks/useAccessEvents";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDevices } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityPanel } from "./ActivityPanel";
import { DonutStat } from "./DonutStat";
import { MetricCard } from "./MetricCard";
import { RecentAccessEvents } from "./RecentAccessEvents";
import { RecentAlerts } from "./RecentAlerts";
import { RecentReadings } from "./RecentReadings";
import { StatsOverview } from "./StatsOverview";
import type { ModuleHealth } from "./SystemHealthCard";
import { SystemHealthCard } from "./SystemHealthCard";

export function ClientDashboard() {
  const queryClient = useQueryClient();
  const { session, username } = useAuth();
  const currentUser = useCurrentUser(Boolean(session?.accessToken));
  const devices = useDevices();
  const sensors = useSensors();
  const alerts = useAlerts({ status: "OPEN" });
  const accessEvents = useAccessEvents({ limit: 6 });

  useEffect(() => {
    if (!session?.accessToken) return;

    return createRealtimeClient(session.accessToken, [
      {
        topic: "/topic/alerts",
        onMessage: () => {
          void queryClient.invalidateQueries({ queryKey: ["alerts"] });
        },
      },
    ]);
  }, [queryClient, session?.accessToken]);

  const devicesData = devices.data ?? [];
  const sensorsData = sensors.data ?? [];
  const alertsData = alerts.data ?? [];
  const accessEventsData = accessEvents.data ?? [];
  const activeDevices = devicesData.filter((device) => device.status === "ACTIVE").length;
  const activeSensors = sensorsData.filter((sensor) => sensor.status === "ACTIVE").length;
  const criticalAlerts = alertsData.filter((alert) => alert.severity === "CRITICAL").length;
  const modules: ModuleHealth[] = [
    {
      label: "Cuenta",
      detail: currentUser.isError ? "Perfil no verificado" : "Sesion cliente activa",
      status: currentUser.isLoading ? "loading" : currentUser.isError ? "warning" : "online",
    },
    {
      label: "Dispositivos",
      detail: devices.isError ? "No se pudieron cargar tus dispositivos" : `${devicesData.length} disponibles`,
      status: devices.isLoading ? "loading" : devices.isError ? "warning" : "online",
    },
    {
      label: "Sensores",
      detail: sensors.isError ? "Sensores no disponibles" : `${sensorsData.length} sensores asociados`,
      status: sensors.isLoading ? "loading" : sensors.isError ? "warning" : "online",
    },
    {
      label: "Alertas",
      detail: alerts.isError ? "Alertas no disponibles" : `${alertsData.length} alertas abiertas`,
      status: alerts.isLoading ? "loading" : alerts.isError ? "warning" : "online",
    },
  ];

  return (
    <>
      <PageHeader
        title="Mi Dashboard"
        description="Vista cliente con el estado de tus dispositivos, sensores, alertas y accesos recientes."
        actions={
          <Badge className="border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
            CLIENTE
          </Badge>
        }
      />

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-slate-400">Bienvenido</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">
          {currentUser.data?.displayName ?? username ?? "Cliente SmartGuard"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Esta vista oculta administracion y acciones globales. Si el backend aun no
          separa datos por cliente, se muestran los datos disponibles sin exponer
          gestion administrativa.
        </p>
      </section>

      <StatsOverview>
        <MetricCard
          title="Mis dispositivos"
          value={devicesData.length}
          description={`${activeDevices} activos`}
          icon={CircuitBoard}
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Mis sensores"
          value={sensorsData.length}
          description={`${activeSensors} reportando estado`}
          icon={RadioReceiver}
          tone="sky"
          isLoading={sensors.isLoading}
          hasError={sensors.isError}
        />
        <MetricCard
          title="Mis alertas"
          value={alertsData.length}
          description={`${criticalAlerts} criticas abiertas`}
          icon={AlertTriangle}
          tone={criticalAlerts > 0 ? "red" : "emerald"}
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title="Mis accesos"
          value={accessEventsData.length}
          description="Eventos RFID recientes"
          icon={Fingerprint}
          tone="amber"
          isLoading={accessEvents.isLoading}
          hasError={accessEvents.isError}
        />
      </StatsOverview>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SystemHealthCard modules={modules} />
        <DonutStat
          title="Sistema protegido"
          value={Math.max(activeDevices + activeSensors - criticalAlerts, 0)}
          total={Math.max(devicesData.length + sensorsData.length, 1)}
          label="Dispositivos y sensores sin alerta critica"
          icon={ShieldCheck}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Mis alertas recientes"
          description="Alertas abiertas de tu sistema."
          icon={AlertTriangle}
        >
          {alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : alerts.isError ? (
            <ErrorState
              tone="warning"
              title="Alertas no disponibles"
              description="No se pudo cargar el modulo de alertas. Tu dashboard sigue operativo."
            />
          ) : (
            <RecentAlerts alerts={alertsData} />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Mis accesos recientes"
          description="Eventos RFID visibles para tu cuenta."
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
            <RecentAccessEvents events={accessEventsData} />
          )}
        </ActivityPanel>
        <ActivityPanel
          title="Ultimas lecturas"
          description="Sensores con actividad reciente."
          icon={RadioReceiver}
          className="xl:col-span-2"
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores" />
          ) : sensors.isError ? (
            <ErrorState
              tone="warning"
              title="Sensores no disponibles"
              description="No se pudo cargar sensores. La vista cliente permanece estable."
            />
          ) : (
            <RecentReadings sensors={sensorsData} />
          )}
        </ActivityPanel>
      </section>
    </>
  );
}
