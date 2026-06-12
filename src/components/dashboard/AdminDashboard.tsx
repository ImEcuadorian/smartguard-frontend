"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  CircuitBoard,
  Cpu,
  Fingerprint,
  RadioReceiver,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents } from "@/hooks/useAccessEvents";
import { useActuators } from "@/hooks/useActuators";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser, useUsers } from "@/hooks/useCurrentUser";
import { useDevices } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import { canManage, getRoleLabel } from "@/lib/auth/roles";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActivityPanel } from "./ActivityPanel";
import { DeviceStatusGrid } from "./DeviceStatusGrid";
import { DonutStat } from "./DonutStat";
import { MetricCard } from "./MetricCard";
import type { ModuleHealth } from "./SystemHealthCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { RecentAccessEvents } from "./RecentAccessEvents";
import { RecentAlerts } from "./RecentAlerts";
import { RecentEventsPanel } from "./RecentEventsPanel";
import { RecentReadings } from "./RecentReadings";
import { StatsOverview } from "./StatsOverview";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { role, session } = useAuth();
  const currentUser = useCurrentUser(Boolean(session?.accessToken));
  const devices = useDevices();
  const sensors = useSensors();
  const alerts = useAlerts({ status: "OPEN" });
  const accessEvents = useAccessEvents({ limit: 8 });
  const actuators = useActuators();
  const users = useUsers(canManage(role));
  const isAdmin = canManage(role);

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

  const devicesData = devices.data ?? [];
  const sensorsData = sensors.data ?? [];
  const alertsData = alerts.data ?? [];
  const accessEventsData = accessEvents.data ?? [];
  const actuatorsData = actuators.data ?? [];
  const usersData = users.data ?? [];
  const activeDevices = devicesData.filter((device) => device.status === "ACTIVE").length;
  const inactiveDevices = devicesData.filter((device) => device.status === "INACTIVE").length;
  const maintenanceDevices = devicesData.filter((device) => device.status === "MAINTENANCE").length;
  const activeSensors = sensorsData.filter((sensor) => sensor.status === "ACTIVE").length;
  const inactiveSensors = sensorsData.filter((sensor) => sensor.status === "INACTIVE").length;
  const maintenanceSensors = sensorsData.filter((sensor) => sensor.status === "MAINTENANCE").length;
  const criticalAlerts = alertsData.filter((alert) => alert.severity === "CRITICAL").length;
  const grantedEvents = accessEventsData.filter((event) => event.result === "GRANTED").length;
  const deniedEvents = accessEventsData.filter((event) => event.result === "DENIED").length;
  const coreError = devices.isError || sensors.isError || alerts.isError;

  const modules: ModuleHealth[] = [
    {
      label: "Backend",
      detail: currentUser.isError ? "Sesion no verificada por backend" : "Autenticacion disponible",
      status: currentUser.isLoading ? "loading" : currentUser.isError ? "warning" : "online",
    },
    {
      label: "Dispositivos",
      detail: devices.isError ? "Modulo no disponible" : `${devicesData.length} ESP32 registrados`,
      status: devices.isLoading ? "loading" : devices.isError ? "offline" : "online",
    },
    {
      label: "Sensores",
      detail: sensors.isError ? "Lecturas no disponibles" : `${sensorsData.length} sensores configurados`,
      status: sensors.isLoading ? "loading" : sensors.isError ? "offline" : "online",
    },
    {
      label: "RFID",
      detail: accessEvents.isError ? "Puede requerir permisos del backend" : `${accessEventsData.length} eventos recientes`,
      status: accessEvents.isLoading ? "loading" : accessEvents.isError ? "warning" : "online",
    },
  ];

  return (
    <>
      <PageHeader
        title={isAdmin ? "Dashboard administrador" : "Dashboard operativo"}
        description="Resumen de cuenta, salud de modulos, actividad reciente y distribucion de estados SmartGuard."
        actions={
          <Badge className="border-[rgb(var(--sg-primary-rgb)/0.35)] bg-[rgb(var(--sg-primary-rgb)/0.12)] text-[var(--sg-primary)]">
            {getRoleLabel(role)}
          </Badge>
        }
      />

      <StatsOverview>
        <MetricCard
          title="Dispositivos totales"
          value={devicesData.length}
          description={`${activeDevices} activos en linea`}
          icon={CircuitBoard}
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Sensores totales"
          value={sensorsData.length}
          description={`${activeSensors} sensores activos`}
          icon={RadioReceiver}
          tone="sky"
          isLoading={sensors.isLoading}
          hasError={sensors.isError}
        />
        <MetricCard
          title="Alertas abiertas"
          value={alertsData.length}
          description={`${criticalAlerts} criticas requieren atencion`}
          icon={AlertTriangle}
          tone={criticalAlerts > 0 ? "red" : "emerald"}
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title="Actuadores"
          value={actuatorsData.length}
          description="Rele, cerraduras, buzzer, LED y servo"
          icon={SlidersHorizontal}
          tone="amber"
          isLoading={actuators.isLoading}
          hasError={actuators.isError}
        />
        <MetricCard
          title="Eventos RFID"
          value={accessEventsData.length}
          description={`${grantedEvents} permitidos, ${deniedEvents} rechazados`}
          icon={Fingerprint}
          tone="primary"
          isLoading={accessEvents.isLoading}
          hasError={accessEvents.isError}
        />
        <MetricCard
          title="Dispositivos activos"
          value={activeDevices}
          description="Disponibilidad operacional"
          icon={ShieldCheck}
          tone="emerald"
          isLoading={devices.isLoading}
          hasError={devices.isError}
        />
        <MetricCard
          title="Alertas criticas"
          value={criticalAlerts}
          description="Prioridad alta del sistema"
          icon={Bell}
          tone={criticalAlerts > 0 ? "red" : "slate"}
          isLoading={alerts.isLoading}
          hasError={alerts.isError}
        />
        <MetricCard
          title={isAdmin ? "Clientes / usuarios" : "Modo operador"}
          value={isAdmin ? usersData.length : "Activo"}
          description={isAdmin ? "Cuentas registradas en SmartGuard" : "Sin administracion de usuarios"}
          icon={isAdmin ? UsersRound : Activity}
          tone="slate"
          isLoading={isAdmin ? users.isLoading : false}
          hasError={isAdmin ? users.isError : false}
        />
      </StatsOverview>

      {coreError ? (
        <div className="mt-4">
          <ErrorState
            tone="warning"
            title="Algunos modulos no respondieron"
            description="El dashboard sigue mostrando la informacion disponible mientras el backend completa permisos o endpoints."
          />
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-4">
        <DonutStat
          title="Estado de dispositivos"
          value={activeDevices}
          total={devicesData.length}
          label="ESP32 activos"
          icon={Cpu}
        />
        <DonutStat
          title="Sensores activos"
          value={activeSensors}
          total={sensorsData.length}
          label="Telemetria disponible"
          icon={RadioReceiver}
          tone="rgb(56 189 248)"
        />
        <DonutStat
          title="Alertas criticas"
          value={criticalAlerts}
          total={Math.max(alertsData.length, criticalAlerts)}
          label="Riesgo abierto"
          icon={AlertTriangle}
          tone="rgb(248 113 113)"
        />
        <DonutStat
          title="Accesos concedidos"
          value={grantedEvents}
          total={Math.max(accessEventsData.length, grantedEvents)}
          label="RFID reciente"
          icon={Fingerprint}
          tone="rgb(52 211 153)"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SystemHealthCard modules={modules} />
        <DeviceStatusGrid
          title="Distribucion de dispositivos"
          values={{
            ACTIVE: activeDevices,
            INACTIVE: inactiveDevices,
            MAINTENANCE: maintenanceDevices,
          }}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <RecentEventsPanel
          title="Alertas recientes"
          description="Eventos abiertos que requieren seguimiento operativo."
        >
          {alerts.isLoading ? (
            <LoadingState label="Cargando alertas" />
          ) : alerts.isError ? (
            <ErrorState
              tone="warning"
              title="Alertas no disponibles"
              description="No se pudo consultar el modulo de alertas. El resto del dashboard sigue operativo."
            />
          ) : (
            <RecentAlerts alerts={alertsData} />
          )}
        </RecentEventsPanel>
        <RecentEventsPanel
          title="Eventos RFID recientes"
          description="Lecturas de tarjetas autorizadas y rechazadas."
        >
          {accessEvents.isLoading ? (
            <LoadingState label="Cargando RFID" />
          ) : accessEvents.isError ? (
            <ErrorState
              tone="info"
              title="RFID no disponible"
              description="El modulo RFID puede estar limitado por permisos del backend. El resto del sistema funciona correctamente."
            />
          ) : (
            <RecentAccessEvents events={accessEventsData} />
          )}
        </RecentEventsPanel>
        <ActivityPanel
          title="Lecturas recientes por sensor"
          description="Ultima actividad registrada por sensores del sistema."
          icon={RadioReceiver}
          className="xl:col-span-2"
        >
          {sensors.isLoading ? (
            <LoadingState label="Cargando sensores" />
          ) : sensors.isError ? (
            <ErrorState
              tone="warning"
              title="Sensores no disponibles"
              description="No se pudo cargar sensores, pero la consola permanece navegable."
            />
          ) : (
            <RecentReadings sensors={sensorsData} />
          )}
        </ActivityPanel>
        <DeviceStatusGrid
          title="Distribucion de sensores"
          values={{
            ACTIVE: activeSensors,
            INACTIVE: inactiveSensors,
            MAINTENANCE: maintenanceSensors,
          }}
        />
      </section>
    </>
  );
}
