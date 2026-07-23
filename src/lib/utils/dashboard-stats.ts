import type {
  AccessEventResponse,
  ActuatorResponse,
  AlertResponse,
  DeviceResponse,
  SensorResponse,
  UserAccountResponse,
} from "@/lib/api/types";
import type { TimeRangeId } from "./time-range";
import { filterByTimeRange } from "./time-range";

function countBy<T extends string>(values: T[]) {
  return values.reduce(
    (acc, value) => {
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<T, number>>,
  );
}

function countByField<T, K extends string>(
  values: T[],
  getKey: (value: T) => K | null | undefined,
) {
  return values.reduce(
    (acc, value) => {
      const key = getKey(value);
      if (!key) return acc;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<K, number>,
  );
}

export function getDeviceStats(devices: DeviceResponse[]) {
  const byStatus = countBy(devices.map((device) => device.status));

  return {
    total: devices.length,
    active: byStatus.ACTIVE ?? 0,
    inactive: byStatus.INACTIVE ?? 0,
    maintenance: byStatus.MAINTENANCE ?? 0,
  };
}

export function getSensorStats(
  sensors: SensorResponse[],
  alerts: AlertResponse[] = [],
) {
  const byStatus = countBy(sensors.map((sensor) => sensor.status));
  const byType = countBy(sensors.map((sensor) => sensor.type));
  const openCriticalSensorIds = new Set(
    alerts
      .filter((alert) => alert.status === "OPEN" && alert.severity === "CRITICAL")
      .map((alert) => alert.sensorId)
      .filter(Boolean),
  );

  return {
    total: sensors.length,
    active: byStatus.ACTIVE ?? 0,
    inactive: byStatus.INACTIVE ?? 0,
    maintenance: byStatus.MAINTENANCE ?? 0,
    byType,
    byStatus,
    boolean: sensors.filter((sensor) =>
      ["DOOR", "MOTION", "EMERGENCY_BUTTON"].includes(sensor.type),
    ).length,
    numeric: sensors.filter(
      (sensor) => !["DOOR", "MOTION", "EMERGENCY_BUTTON"].includes(sensor.type),
    ).length,
    critical: sensors.filter(
      (sensor) => sensor.status !== "ACTIVE" || openCriticalSensorIds.has(sensor.id),
    ).length,
    byDevice: countByField(sensors, (sensor) => sensor.deviceId),
  };
}

export function getAlertStats(alerts: AlertResponse[], range: TimeRangeId) {
  const visibleAlerts = filterByTimeRange(alerts, range, (alert) => alert.occurredAt);
  const byStatus = countBy(visibleAlerts.map((alert) => alert.status));
  const bySeverity = countBy(visibleAlerts.map((alert) => alert.severity));

  return {
    visible: visibleAlerts,
    total: visibleAlerts.length,
    open: byStatus.OPEN ?? 0,
    acknowledged: byStatus.ACKNOWLEDGED ?? 0,
    resolved: byStatus.RESOLVED ?? 0,
    critical: bySeverity.CRITICAL ?? 0,
    warning: bySeverity.WARNING ?? 0,
    info: bySeverity.INFO ?? 0,
    byStatus,
    bySeverity,
    byDevice: countByField(visibleAlerts, (alert) => alert.deviceId),
  };
}

export function getAccessStats(events: AccessEventResponse[], range: TimeRangeId) {
  const visibleEvents = filterByTimeRange(events, range, (event) => event.occurredAt);
  const byResult = countBy(visibleEvents.map((event) => event.result));

  return {
    visible: visibleEvents,
    total: visibleEvents.length,
    granted: byResult.GRANTED ?? 0,
    denied: byResult.DENIED ?? 0,
    grantedRate: visibleEvents.length
      ? Math.round(((byResult.GRANTED ?? 0) / visibleEvents.length) * 100)
      : 0,
    byDevice: countByField(visibleEvents, (event) => event.deviceId),
  };
}

export function getActuatorStats(actuators: ActuatorResponse[]) {
  const byStatus = countBy(actuators.map((actuator) => actuator.status));
  const byType = countBy(actuators.map((actuator) => actuator.type));

  return {
    total: actuators.length,
    active: byStatus.ACTIVE ?? 0,
    inactive: byStatus.INACTIVE ?? 0,
    maintenance: byStatus.MAINTENANCE ?? 0,
    byStatus,
    byType,
    byDevice: countByField(actuators, (actuator) => actuator.deviceId),
  };
}

function buildDeviceHealth({
  devices,
  sensors,
  actuators,
  alerts,
}: {
  devices: DeviceResponse[];
  sensors: SensorResponse[];
  actuators: ActuatorResponse[];
  alerts: AlertResponse[];
}) {
  return devices.map((device) => {
    const deviceSensors = sensors.filter((sensor) => sensor.deviceId === device.id);
    const deviceActuators = actuators.filter(
      (actuator) => actuator.deviceId === device.id,
    );
    const openAlerts = alerts.filter(
      (alert) => alert.deviceId === device.id && alert.status === "OPEN",
    );
    const activeSensors = deviceSensors.filter(
      (sensor) => sensor.status === "ACTIVE",
    ).length;
    const activeActuators = deviceActuators.filter(
      (actuator) => actuator.status === "ACTIVE",
    ).length;
    const score = Math.max(
      0,
      Math.round(
        ((device.status === "ACTIVE" ? 0.45 : 0) +
          (deviceSensors.length ? (activeSensors / deviceSensors.length) * 0.35 : 0.25) +
          (deviceActuators.length
            ? (activeActuators / deviceActuators.length) * 0.2
            : 0.15) -
          Math.min(0.4, openAlerts.length * 0.1)) *
          100,
      ),
    );

    return {
      deviceId: device.id,
      score,
      sensors: deviceSensors.length,
      actuators: deviceActuators.length,
      openAlerts: openAlerts.length,
    };
  });
}

function buildKitchenStatus({
  sensors,
  alerts,
  systemScore,
}: {
  sensors: SensorResponse[];
  alerts: AlertResponse[];
  systemScore: number;
}) {
  const openAlerts = alerts.filter((alert) => alert.status === "OPEN");
  const sensorById = new Map(sensors.map((sensor) => [sensor.id, sensor]));
  const hasAlertForSensorType = (types: string[]) =>
    openAlerts.some((alert) => {
      const sensor = alert.sensorId ? sensorById.get(alert.sensorId) : null;
      return sensor ? types.includes(sensor.type) : false;
    });
  const hasAlertType = (types: string[]) =>
    openAlerts.some((alert) => types.includes(alert.type));
  const critical = openAlerts.some((alert) => alert.severity === "CRITICAL");
  const gasRisk = hasAlertType(["GAS_DETECTED"]) || hasAlertForSensorType(["GAS"]);
  const temperatureRisk =
    hasAlertType(["THRESHOLD_EXCEEDED"]) ||
    hasAlertForSensorType(["TEMPERATURE"]);
  const humidityRisk = hasAlertForSensorType(["HUMIDITY"]);
  const doorOpen = hasAlertType(["DOOR_OPEN"]) || hasAlertForSensorType(["DOOR"]);
  const motionDetected =
    hasAlertType(["MOTION_DETECTED"]) || hasAlertForSensorType(["MOTION"]);
  const emergency =
    hasAlertType(["EMERGENCY_BUTTON"]) ||
    hasAlertForSensorType(["EMERGENCY_BUTTON"]);
  const tone: "critical" | "warning" | "stable" =
    critical || gasRisk || emergency
      ? "critical"
      : openAlerts.length
        ? "warning"
        : "stable";

  return {
    tone,
    label:
      tone === "critical"
        ? "Critico"
        : tone === "warning"
          ? "Atencion"
          : "Sistema estable",
    description:
      tone === "critical"
        ? "Hay riesgos abiertos que requieren accion inmediata."
        : tone === "warning"
          ? "Existen eventos que conviene revisar durante la operacion."
          : "No hay alertas abiertas en la ventana seleccionada.",
    score: systemScore,
    gasRisk,
    temperatureRisk,
    humidityRisk,
    doorOpen,
    motionDetected,
    emergency,
  };
}

export function getSystemScore({
  activeDevices,
  totalDevices,
  activeSensors,
  totalSensors,
  criticalAlerts,
}: {
  activeDevices: number;
  totalDevices: number;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
}) {
  const deviceScore = totalDevices ? activeDevices / totalDevices : 1;
  const sensorScore = totalSensors ? activeSensors / totalSensors : 1;
  const alertPenalty = Math.min(0.45, criticalAlerts * 0.15);
  return Math.max(0, Math.round(((deviceScore + sensorScore) / 2 - alertPenalty) * 100));
}

export function buildAdminStats({
  devices,
  sensors,
  alerts,
  accessEvents,
  actuators,
  users,
  range,
}: {
  devices: DeviceResponse[];
  sensors: SensorResponse[];
  alerts: AlertResponse[];
  accessEvents: AccessEventResponse[];
  actuators: ActuatorResponse[];
  users: UserAccountResponse[];
  range: TimeRangeId;
}) {
  const deviceStats = getDeviceStats(devices);
  const alertStats = getAlertStats(alerts, range);
  const sensorStats = getSensorStats(sensors, alertStats.visible);
  const accessStats = getAccessStats(accessEvents, range);
  const actuatorStats = getActuatorStats(actuators);
  const systemScore = getSystemScore({
    activeDevices: deviceStats.active,
    totalDevices: deviceStats.total,
    activeSensors: sensorStats.active,
    totalSensors: sensorStats.total,
    criticalAlerts: alertStats.critical,
  });

  return {
    devices: deviceStats,
    sensors: sensorStats,
    alerts: alertStats,
    access: accessStats,
    actuators: actuatorStats,
    users: {
      total: users.length,
      active: users.filter((user) => user.status === "ACTIVE").length,
      disabled: users.filter((user) => user.status === "DISABLED").length,
      admins: users.filter((user) => user.role === "ADMIN").length,
      operators: users.filter((user) => user.role === "OPERATOR").length,
      viewers: users.filter((user) => user.role === "VIEWER").length,
    },
    relations: {
      sensorsByDevice: countByField(sensors, (sensor) => sensor.deviceId),
      actuatorsByDevice: countByField(actuators, (actuator) => actuator.deviceId),
      alertsByDevice: alertStats.byDevice,
      deviceHealth: buildDeviceHealth({
        devices,
        sensors,
        actuators,
        alerts: alertStats.visible,
      }),
    },
    kitchen: buildKitchenStatus({
      sensors,
      alerts: alertStats.visible,
      systemScore,
    }),
    systemScore,
  };
}
