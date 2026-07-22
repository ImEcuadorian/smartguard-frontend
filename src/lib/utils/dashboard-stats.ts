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

export function getDeviceStats(devices: DeviceResponse[]) {
  const byStatus = countBy(devices.map((device) => device.status));

  return {
    total: devices.length,
    active: byStatus.ACTIVE ?? 0,
    inactive: byStatus.INACTIVE ?? 0,
    maintenance: byStatus.MAINTENANCE ?? 0,
  };
}

export function getSensorStats(sensors: SensorResponse[]) {
  const byStatus = countBy(sensors.map((sensor) => sensor.status));
  const byType = countBy(sensors.map((sensor) => sensor.type));

  return {
    total: sensors.length,
    active: byStatus.ACTIVE ?? 0,
    inactive: byStatus.INACTIVE ?? 0,
    maintenance: byStatus.MAINTENANCE ?? 0,
    byType,
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
  const sensorStats = getSensorStats(sensors);
  const alertStats = getAlertStats(alerts, range);
  const accessStats = getAccessStats(accessEvents, range);
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
    actuators: {
      total: actuators.length,
      active: actuators.filter((actuator) => actuator.status === "ACTIVE").length,
    },
    users: {
      total: users.length,
      active: users.filter((user) => user.status === "ACTIVE").length,
    },
    systemScore,
  };
}
