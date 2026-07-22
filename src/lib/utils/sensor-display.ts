import type {
  SensorReadingResponse,
  SensorResponse,
  SensorType,
} from "@/lib/api/types";

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
  label: string;
  value: string;
  tone: SensorDisplayTone;
  icon: SensorDisplayIcon;
  description: string;
  isCritical: boolean;
}

const sensorLabels: Record<SensorType, string> = {
  DOOR: "Puerta",
  GAS: "Gas / humo",
  HUMIDITY: "Humedad",
  LIGHT: "Luz",
  TEMPERATURE: "Temperatura",
  MOTION: "Movimiento",
  DISTANCE: "Distancia",
  EMERGENCY_BUTTON: "Emergencia",
};

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

export function getSensorTypeLabel(type: SensorType) {
  return sensorLabels[type] ?? type;
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

export function getSensorDisplay(
  sensor: Pick<SensorResponse, "type" | "unit" | "status">,
  latestReading?: SensorReadingResponse | null,
): SensorDisplay {
  const value = getReadingValue(latestReading);
  const icon = sensorIcons[sensor.type] ?? "sensor";
  const offlineDisplay: SensorDisplay = {
    label: getSensorTypeLabel(sensor.type),
    value: sensor.status === "ACTIVE" ? "Sin lectura" : sensor.status,
    tone: sensor.status === "ACTIVE" ? "slate" : "amber",
    icon,
    description:
      sensor.status === "ACTIVE"
        ? "Esperando telemetria reciente."
        : "Sensor fuera de operacion normal.",
    isCritical: sensor.status !== "ACTIVE",
  };

  if (value === null || value === undefined || value === "") {
    return offlineDisplay;
  }

  if (sensor.type === "DOOR") {
    const open = Boolean(value);
    return {
      label: "Puerta",
      value: open ? "Abierta" : "Cerrada",
      tone: open ? "red" : "emerald",
      icon,
      description: open ? "Acceso fisico abierto." : "Acceso fisico cerrado.",
      isCritical: open,
    };
  }

  if (sensor.type === "MOTION") {
    const detected = Boolean(value);
    return {
      label: "Movimiento",
      value: detected ? "Detectado" : "Sin movimiento",
      tone: detected ? "amber" : "emerald",
      icon,
      description: detected ? "Movimiento detectado en el area." : "Area estable.",
      isCritical: detected,
    };
  }

  if (sensor.type === "EMERGENCY_BUTTON") {
    const active = Boolean(value);
    return {
      label: "Emergencia",
      value: active ? "Emergencia" : "Normal",
      tone: active ? "red" : "emerald",
      icon,
      description: active ? "Boton de emergencia activado." : "Sin emergencia activa.",
      isCritical: active,
    };
  }

  if (typeof value !== "number") {
    return {
      label: getSensorTypeLabel(sensor.type),
      value: String(value),
      tone: "slate",
      icon,
      description: "Lectura textual recibida desde el dispositivo.",
      isCritical: false,
    };
  }

  if (sensor.type === "GAS") {
    const critical = value >= 700;
    const warning = value >= 400;
    return {
      label: "Gas / humo",
      value: formatNumber(value, sensor.unit),
      tone: critical ? "red" : warning ? "amber" : "emerald",
      icon,
      description: critical ? "Riesgo alto detectado." : warning ? "Nivel elevado." : "Nivel normal.",
      isCritical: critical,
    };
  }

  if (sensor.type === "TEMPERATURE") {
    const critical = value >= 40;
    const warning = value >= 32 || value <= 5;
    return {
      label: "Temperatura",
      value: formatNumber(value, sensor.unit ?? "°C"),
      tone: critical ? "red" : warning ? "amber" : "emerald",
      icon,
      description: critical ? "Temperatura critica." : warning ? "Fuera del rango ideal." : "Rango normal.",
      isCritical: critical,
    };
  }

  if (sensor.type === "HUMIDITY") {
    const warning = value < 30 || value > 75;
    return {
      label: "Humedad",
      value: formatNumber(value, sensor.unit ?? "%"),
      tone: warning ? "amber" : "emerald",
      icon,
      description: warning ? "Humedad fuera de rango." : "Humedad normal.",
      isCritical: false,
    };
  }

  if (sensor.type === "LIGHT") {
    const label = value >= 700 ? "Luz alta" : value >= 300 ? "Luz media" : "Luz baja";
    return {
      label: "Luz",
      value: sensor.unit ? formatNumber(value, sensor.unit) : label,
      tone: "sky",
      icon,
      description: sensor.unit ? label : "Nivel de iluminacion estimado.",
      isCritical: false,
    };
  }

  if (sensor.type === "DISTANCE") {
    const close = value <= 20;
    return {
      label: "Distancia",
      value: formatNumber(value, sensor.unit ?? "cm"),
      tone: close ? "amber" : "emerald",
      icon,
      description: close ? "Objeto cercano detectado." : "Distancia normal.",
      isCritical: false,
    };
  }

  return {
    label: getSensorTypeLabel(sensor.type),
    value: formatNumber(value, sensor.unit),
    tone: "slate",
    icon,
    description: "Lectura numerica recibida.",
    isCritical: false,
  };
}
