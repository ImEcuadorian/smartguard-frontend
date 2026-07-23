import type {
  AccessEventResponse,
  AlertResponse,
  SensorResponse,
} from "@/lib/api/types";
import { getSensorTypeLabel } from "./labels";
import type { SensorDisplayTone } from "./sensor-display";

export type ActivityLogType = "alert" | "access" | "sensor" | "actuator";

export interface ActivityLogItem {
  id: string;
  type: ActivityLogType;
  title: string;
  description: string;
  result: string;
  occurredAt: string | null;
  tone: SensorDisplayTone;
}

function alertTone(alert: AlertResponse): SensorDisplayTone {
  if (alert.severity === "CRITICAL") return "red";
  if (alert.severity === "WARNING") return "amber";
  return "sky";
}

export function buildActivityLog({
  alerts,
  accessEvents,
  sensors,
}: {
  alerts: AlertResponse[];
  accessEvents: AccessEventResponse[];
  sensors: SensorResponse[];
}): ActivityLogItem[] {
  const alertItems: ActivityLogItem[] = alerts.map((alert) => ({
    id: `alert-${alert.id}`,
    type: "alert",
    title:
      alert.severity === "CRITICAL"
        ? "Alerta critica generada"
        : "Alerta registrada",
    description: alert.message,
    result: alert.status,
    occurredAt: alert.occurredAt,
    tone: alertTone(alert),
  }));

  const accessItems: ActivityLogItem[] = accessEvents.map((event) => ({
    id: `access-${event.id}`,
    type: "access",
    title:
      event.result === "GRANTED"
        ? `Acceso concedido por tarjeta ${event.cardUid}`
        : `Acceso denegado: ${event.cardUid}`,
    description: event.reason || "Evento RFID registrado.",
    result: event.result,
    occurredAt: event.occurredAt,
    tone: event.result === "GRANTED" ? "emerald" : "red",
  }));

  const sensorItems: ActivityLogItem[] = sensors
    .filter((sensor) => sensor.lastReadingAt)
    .map((sensor) => ({
      id: `sensor-${sensor.id}`,
      type: "sensor",
      title: `Sensor ${sensor.name}`,
      description: `${getSensorTypeLabel(sensor.type)} reporto actividad reciente.`,
      result: sensor.status,
      occurredAt: sensor.lastReadingAt,
      tone: sensor.status === "ACTIVE" ? "emerald" : "amber",
    }));

  return [...alertItems, ...accessItems, ...sensorItems]
    .filter((item) => item.occurredAt)
    .sort(
      (a, b) =>
        new Date(b.occurredAt ?? 0).getTime() -
        new Date(a.occurredAt ?? 0).getTime(),
    );
}
