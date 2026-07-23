import type {
  SensorReadingResponse,
  SensorResponse,
  SensorType,
} from "@/lib/api/types";
import { getSensorTypeLabel as getHumanSensorTypeLabel } from "./labels";

export type SensorDisplayTone =
  | "primary"
  | "emerald"
  | "amber"
  | "red"
  | "sky"
  | "slate";

export type SensorDisplayIcon =
  | "door"
  | "motion"
  | "gas"
  | "temperature"
  | "humidity"
  | "light"
  | "distance"
  | "emergency"
  | "sensor";

export interface SensorDisplay {
  title: string;
  label: string;
  value: string;
  displayValue: string;
  statusLabel: string;
  tone: SensorDisplayTone;
  icon: SensorDisplayIcon;
  description: string;
  recommendation: string;
  isBoolean: boolean;
  isCritical: boolean;
}

const sensorIcons: Record<SensorType, SensorDisplayIcon> = {
  DOOR: "door",
  GAS: "gas",
  HUMIDITY: "humidity",
  LIGHT: "light",
  TEMPERATURE: "temperature",
  MOTION: "motion",
  DISTANCE: "distance",
  EMERGENCY_BUTTON: "emergency",
};

const booleanSensorTypes = new Set<SensorType>([
  "DOOR",
  "MOTION",
  "EMERGENCY_BUTTON",
]);

export function getSensorTypeLabel(type: SensorType) {
  return getHumanSensorTypeLabel(type);
}

function formatNumber(value: number, unit?: string | null) {
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return unit ? `${formatted} ${unit}` : formatted;
}

function getReadingValue(reading?: SensorReadingResponse | null) {
  if (!reading) return null;
  if (reading.booleanValue !== null) return reading.booleanValue;
  if (reading.numericValue !== null) return reading.numericValue;
  return reading.textValue;
}

function buildDisplay(display: Omit<SensorDisplay, "title"> & { title?: string }) {
  return {
    ...display,
    title: display.title ?? display.label,
  };
}

export function getSensorDisplay(
  sensor: Pick<SensorResponse, "type" | "unit" | "status">,
  latestReading?: SensorReadingResponse | null,
): SensorDisplay {
  const value = getReadingValue(latestReading);
  const icon = sensorIcons[sensor.type] ?? "sensor";
  const label = getSensorTypeLabel(sensor.type);
  const isBoolean = booleanSensorTypes.has(sensor.type);
  const offlineDisplay: SensorDisplay = buildDisplay({
    label,
    value: sensor.status === "ACTIVE" ? "Sin lectura" : sensor.status,
    displayValue: sensor.status === "ACTIVE" ? "Sin lectura" : sensor.status,
    statusLabel: sensor.status === "ACTIVE" ? "Sin lectura" : sensor.status,
    tone: sensor.status === "ACTIVE" ? "slate" : "amber",
    icon,
    description:
      sensor.status === "ACTIVE"
        ? "Esperando telemetria reciente."
        : "Sensor fuera de operacion normal.",
    recommendation:
      sensor.status === "ACTIVE"
        ? "Verifica que el ESP32 envie una lectura reciente."
        : "Revisa conexion, energia o mantenimiento del sensor.",
    isBoolean,
    isCritical: sensor.status !== "ACTIVE",
  });

  if (value === null || value === undefined || value === "") {
    return offlineDisplay;
  }

  if (sensor.type === "DOOR") {
    const open = Boolean(value);
    return buildDisplay({
      label: "Puerta",
      value: open ? "Abierta" : "Cerrada",
      displayValue: open ? "Abierta" : "Cerrada",
      statusLabel: open ? "Abierta" : "Cerrada",
      tone: open ? "red" : "emerald",
      icon,
      description: open ? "Acceso fisico abierto." : "Acceso fisico cerrado.",
      recommendation: open
        ? "Confirma si la puerta debe permanecer abierta en cocina."
        : "Entrada controlada correctamente.",
      isBoolean: true,
      isCritical: open,
    });
  }

  if (sensor.type === "MOTION") {
    const detected = Boolean(value);
    return buildDisplay({
      label: "Movimiento",
      value: detected ? "Detectado" : "Sin movimiento",
      displayValue: detected ? "Movimiento detectado" : "Sin movimiento",
      statusLabel: detected ? "Detectado" : "Sin movimiento",
      tone: detected ? "amber" : "emerald",
      icon,
      description: detected ? "Movimiento detectado en el area." : "Area estable.",
      recommendation: detected
        ? "Revisa actividad reciente si no hay personal autorizado."
        : "Sin movimiento relevante detectado.",
      isBoolean: true,
      isCritical: detected,
    });
  }

  if (sensor.type === "EMERGENCY_BUTTON") {
    const active = Boolean(value);
    return buildDisplay({
      label: "Emergencia",
      value: active ? "Emergencia" : "Normal",
      displayValue: active ? "Emergencia activada" : "Normal",
      statusLabel: active ? "Emergencia" : "Normal",
      tone: active ? "red" : "emerald",
      icon,
      description: active ? "Boton de emergencia activado." : "Sin emergencia activa.",
      recommendation: active
        ? "Atiende el punto de emergencia inmediatamente."
        : "Boton de emergencia en estado normal.",
      isBoolean: true,
      isCritical: active,
    });
  }

  if (typeof value !== "number") {
    return buildDisplay({
      label,
      value: String(value),
      displayValue: String(value),
      statusLabel: String(value),
      tone: "slate",
      icon,
      description: "Lectura textual recibida desde el dispositivo.",
      recommendation: "Revisa el detalle tecnico si el texto no es esperado.",
      isBoolean: false,
      isCritical: false,
    });
  }

  if (sensor.type === "GAS") {
    const critical = value >= 700;
    const warning = value >= 400;
    return buildDisplay({
      label: "Gas / humo",
      value: formatNumber(value, sensor.unit),
      displayValue: formatNumber(value, sensor.unit),
      statusLabel: critical ? "Riesgo" : warning ? "Nivel elevado" : "Normal",
      tone: critical ? "red" : warning ? "amber" : "emerald",
      icon,
      description: critical
        ? "Riesgo alto detectado."
        : warning
          ? "Nivel elevado."
          : "Nivel normal.",
      recommendation: critical
        ? "Ventila la cocina y revisa posible fuga de gas o humo."
        : warning
          ? "Mantente atento y verifica extractores."
          : "Calidad de aire dentro de rango.",
      isBoolean: false,
      isCritical: critical,
    });
  }

  if (sensor.type === "TEMPERATURE") {
    const critical = value >= 40;
    const warning = value >= 32 || value <= 5;
    return buildDisplay({
      label: "Temperatura",
      value: formatNumber(value, sensor.unit ?? "C"),
      displayValue: formatNumber(value, sensor.unit ?? "C"),
      statusLabel: critical ? "Critica" : warning ? "Alta/Baja" : "Normal",
      tone: critical ? "red" : warning ? "amber" : "emerald",
      icon,
      description: critical
        ? "Temperatura critica."
        : warning
          ? "Fuera del rango ideal."
          : "Rango normal.",
      recommendation: critical
        ? "Revisa fuentes de calor y ventilacion de la cocina."
        : warning
          ? "Monitorea equipos termicos y ambiente."
          : "Temperatura operativa estable.",
      isBoolean: false,
      isCritical: critical,
    });
  }

  if (sensor.type === "HUMIDITY") {
    const warning = value < 30 || value > 75;
    return buildDisplay({
      label: "Humedad",
      value: formatNumber(value, sensor.unit ?? "%"),
      displayValue: formatNumber(value, sensor.unit ?? "%"),
      statusLabel: warning ? "Fuera de rango" : "Normal",
      tone: warning ? "amber" : "emerald",
      icon,
      description: warning ? "Humedad fuera de rango." : "Humedad normal.",
      recommendation: warning
        ? "Verifica ventilacion, condensacion o extraccion."
        : "Humedad dentro de rango operativo.",
      isBoolean: false,
      isCritical: false,
    });
  }

  if (sensor.type === "LIGHT") {
    const lightLabel =
      value >= 700 ? "Luz alta" : value >= 300 ? "Luz media" : "Luz baja";
    return buildDisplay({
      label: "Luz",
      value: sensor.unit ? formatNumber(value, sensor.unit) : lightLabel,
      displayValue: sensor.unit ? formatNumber(value, sensor.unit) : lightLabel,
      statusLabel: lightLabel,
      tone: "sky",
      icon,
      description: sensor.unit ? lightLabel : "Nivel de iluminacion estimado.",
      recommendation: "Ajusta iluminacion si afecta visibilidad de operacion.",
      isBoolean: false,
      isCritical: false,
    });
  }

  if (sensor.type === "DISTANCE") {
    const close = value <= 20;
    return buildDisplay({
      label: "Distancia",
      value: formatNumber(value, sensor.unit ?? "cm"),
      displayValue: formatNumber(value, sensor.unit ?? "cm"),
      statusLabel: close ? "Objeto cercano" : "Normal",
      tone: close ? "amber" : "emerald",
      icon,
      description: close ? "Objeto cercano detectado." : "Distancia normal.",
      recommendation: close
        ? "Verifica obstaculos o cierre fisico cercano."
        : "Distancia sin riesgo operativo.",
      isBoolean: false,
      isCritical: false,
    });
  }

  return buildDisplay({
    label,
    value: formatNumber(value, sensor.unit),
    displayValue: formatNumber(value, sensor.unit),
    statusLabel: "Lectura",
    tone: "slate",
    icon,
    description: "Lectura numerica recibida.",
    recommendation: "Interpreta la lectura segun el umbral operativo configurado.",
    isBoolean: false,
    isCritical: false,
  });
}
