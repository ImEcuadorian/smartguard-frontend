import type {
  AccessResult,
  ActuatorCommandStatus,
  ActuatorCommandType,
  ActuatorStatus,
  ActuatorType,
  AlertSeverity,
  AlertStatus,
  DeviceStatus,
  SensorStatus,
  SensorType,
  UserRole,
  UserStatus,
} from "@/lib/api/types";

const statusLabels: Record<
  | DeviceStatus
  | SensorStatus
  | ActuatorStatus
  | AlertStatus
  | UserStatus
  | ActuatorCommandStatus
  | AccessResult,
  string
> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  MAINTENANCE: "Mantenimiento",
  OPEN: "Abierta",
  ACKNOWLEDGED: "Reconocida",
  RESOLVED: "Resuelta",
  DISABLED: "Deshabilitado",
  PENDING: "Pendiente",
  SENT: "Enviado",
  FAILED: "Fallido",
  GRANTED: "Permitido",
  DENIED: "Rechazado",
};

const severityLabels: Record<AlertSeverity, string> = {
  INFO: "Informativa",
  WARNING: "Advertencia",
  CRITICAL: "Critica",
};

const accessResultLabels: Record<AccessResult, string> = {
  GRANTED: "Permitido",
  DENIED: "Rechazado",
};

const sensorTypeLabels: Record<SensorType, string> = {
  DOOR: "Puerta",
  GAS: "Gas / humo",
  HUMIDITY: "Humedad",
  LIGHT: "Luz",
  TEMPERATURE: "Temperatura",
  MOTION: "Movimiento",
  DISTANCE: "Distancia",
  EMERGENCY_BUTTON: "Boton de emergencia",
};

const actuatorTypeLabels: Record<ActuatorType, string> = {
  BUZZER: "Buzzer / sirena",
  LED: "Luz LED",
  RELAY: "Rele",
  SERVO: "Servo",
  SOLENOID_LOCK: "Cerradura",
};

const actuatorCommandLabels: Record<ActuatorCommandType, string> = {
  OPEN_DOOR: "Abrir puerta",
  CLOSE_DOOR: "Cerrar puerta",
  LOCK: "Bloquear",
  UNLOCK: "Desbloquear",
  TURN_ON: "Encender",
  TURN_OFF: "Apagar",
  BEEP: "Probar buzzer",
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  OPERATOR: "Operador",
  VIEWER: "Cliente",
};

export function getStatusLabel(status: string) {
  return statusLabels[status as keyof typeof statusLabels] ?? status;
}

export function getSeverityLabel(severity: AlertSeverity | string) {
  return severityLabels[severity as AlertSeverity] ?? severity;
}

export function getAccessResultLabel(result: AccessResult | string) {
  return accessResultLabels[result as AccessResult] ?? result;
}

export function getSensorTypeLabel(type: SensorType | string) {
  return sensorTypeLabels[type as SensorType] ?? type;
}

export function getActuatorTypeLabel(type: ActuatorType | string) {
  return actuatorTypeLabels[type as ActuatorType] ?? type;
}

export function getActuatorCommandLabel(command: ActuatorCommandType | string) {
  return actuatorCommandLabels[command as ActuatorCommandType] ?? command;
}

export function getHumanRoleLabel(role: UserRole | string | undefined) {
  if (!role) return "Sin rol";
  return roleLabels[role as UserRole] ?? role;
}
