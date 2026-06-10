"use client";

import { AlertTriangle, CircuitBoard, RadioReceiver, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessEvents } from "@/hooks/useAccessEvents";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import { useDevices } from "@/hooks/useDevices";
import { useSensors } from "@/hooks/useSensors";
import { createRealtimeClient } from "@/lib/realtime/stomp-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { RecentAccessEvents } from "./RecentAccessEvents";
import { RecentAlerts } from "./RecentAlerts";
import { RecentReadings } from "./RecentReadings";
import { StatCard } from "./StatCard";

export function DashboardOverview() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const devices = useDevices();
  const sensors = useSensors();
  const alerts = useAlerts({ status: "OPEN" });
  const accessEvents = useAccessEvents({ limit: 8 });

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
  const activeDevices =
    devicesData.filter((device) => device.status === "ACTIVE").length ?? 0;
  const criticalAlerts =
    alertsData.filter((alert) => alert.severity === "CRITICAL").length ?? 0;
  const activeSensors =
    sensorsData.filter((sensor) => sensor.status === "ACTIVE").length ?? 0;
  const systemStatus = criticalAlerts > 0 ? "Atencion" : "Operativo";
  const hasCoreError = devices.isError || sensors.isError || alerts.isError;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen operativo de dispositivos ESP32, sensores, accesos RFID, actuadores y alertas."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Dispositivos activos"
          value={devices.isLoading ? "--" : activeDevices}
          detail={devices.isError ? "Modulo no disponible" : `${devicesData.length} registrados`}
          icon={CircuitBoard}
        />
        <StatCard
          title="Alertas criticas"
          value={alerts.isLoading ? "--" : criticalAlerts}
          detail={alerts.isError ? "Alertas no disponibles" : `${alertsData.length} abiertas`}
          icon={AlertTriangle}
          tone={criticalAlerts > 0 ? "red" : "slate"}
        />
        <StatCard
          title="Sensores activos"
          value={sensors.isLoading ? "--" : activeSensors}
          detail={sensors.isError ? "Sensores no disponibles" : `${sensorsData.length} configurados`}
          icon={RadioReceiver}
          tone="amber"
        />
        <StatCard
          title="Estado general"
          value={systemStatus}
          detail="Segun alertas abiertas"
          icon={ShieldCheck}
          tone={criticalAlerts > 0 ? "red" : "teal"}
        />
      </section>
      {hasCoreError ? (
        <div className="mt-4">
          <ErrorState
            tone="warning"
            title="Algunos modulos no respondieron"
            description="El dashboard sigue mostrando la informacion disponible mientras el backend completa permisos o endpoints."
          />
        </div>
      ) : null}
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ultimas alertas abiertas</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos RFID recientes</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Lecturas recientes por sensor</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </section>
    </>
  );
}
