export type UUID = string;
export type ISODateTime = string;

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";
export type DeviceStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type SensorStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type SensorType =
  | "TEMPERATURE"
  | "HUMIDITY"
  | "GAS"
  | "MOTION"
  | "DOOR"
  | "LIGHT"
  | "DISTANCE"
  | "EMERGENCY_BUTTON";

export type ComparisonOperator =
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "EQUAL";

export type SensorAlertRuleType =
  | "NUMERIC_THRESHOLD"
  | "BOOLEAN_MATCH"
  | "DURATION_OPEN"
  | "NO_READING";

export type AlertType =
  | "GAS_DETECTED"
  | "MOTION_DETECTED"
  | "DOOR_OPEN"
  | "EMERGENCY_BUTTON"
  | "ACCESS_DENIED"
  | "DEVICE_OFFLINE"
  | "THRESHOLD_EXCEEDED";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

export type AccessReaderType = "RFID_RC522" | "NFC_PN532";
export type AccessReaderStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type RfidCardStatus = "ACTIVE" | "BLOCKED" | "INACTIVE";
export type AccessResult = "GRANTED" | "DENIED";

export type ActuatorType = "RELAY" | "SERVO" | "BUZZER" | "LED" | "SOLENOID_LOCK";
export type ActuatorStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
export type ActuatorCommandType =
  | "OPEN_DOOR"
  | "CLOSE_DOOR"
  | "LOCK"
  | "UNLOCK"
  | "TURN_ON"
  | "TURN_OFF"
  | "BEEP";
export type ActuatorCommandStatus = "PENDING" | "SENT" | "FAILED";

export interface ApiErrorResponse {
  timestamp: ISODateTime;
  status: number;
  error: string;
  message: string;
  path: string;
  validation?: Record<string, string>;
}

export interface AuthResponse {
  tokenType: "Bearer";
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  username: string;
  role: UserRole;
}

export type UserStatus = "ACTIVE" | "DISABLED";

export interface UserAccountResponse {
  id: UUID;
  username: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface DeviceResponse {
  id: UUID;
  code: string;
  name: string;
  location: string | null;
  status: DeviceStatus;
  ipAddress: string | null;
  firmwareVersion: string | null;
  lastSeenAt: ISODateTime | null;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface DeviceRegistrationResponse {
  device: DeviceResponse;
  apiKey: string;
}

export interface SensorResponse {
  id: UUID;
  deviceId: UUID;
  code: string;
  name: string;
  type: SensorType;
  unit: string | null;
  location: string | null;
  status: SensorStatus;
  lastReadingAt: ISODateTime | null;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface SensorReadingResponse {
  id: UUID;
  sensorId: UUID;
  deviceId: UUID;
  numericValue: number | null;
  booleanValue: boolean | null;
  textValue: string | null;
  recordedAt: ISODateTime;
  createdAt: ISODateTime | null;
}

export interface SensorAlertRuleResponse {
  id: UUID;
  sensorId: UUID;
  type: SensorAlertRuleType;
  operator: ComparisonOperator | null;
  thresholdValue: number | null;
  expectedBooleanValue: boolean | null;
  durationMinutes: number | null;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  enabled: boolean;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface AlertResponse {
  id: UUID;
  deviceId: UUID | null;
  sensorId: UUID | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  occurredAt: ISODateTime;
  createdAt: ISODateTime | null;
  acknowledgedAt: ISODateTime | null;
  resolvedAt: ISODateTime | null;
}

export interface AccessReaderResponse {
  id: UUID;
  deviceId: UUID;
  code: string;
  type: AccessReaderType;
  location: string | null;
  status: AccessReaderStatus;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface RfidCardResponse {
  id: UUID;
  uid: string;
  ownerName: string;
  status: RfidCardStatus;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface AccessEventResponse {
  id: UUID;
  deviceId: UUID;
  readerId: UUID;
  cardId: UUID | null;
  cardUid: string;
  result: AccessResult;
  reason: string;
  occurredAt: ISODateTime;
  createdAt: ISODateTime | null;
}

export interface ActuatorResponse {
  id: UUID;
  deviceId: UUID;
  code: string;
  name: string;
  type: ActuatorType;
  location: string | null;
  status: ActuatorStatus;
  createdAt: ISODateTime | null;
  updatedAt: ISODateTime | null;
}

export interface ActuatorCommandResponse {
  id: UUID;
  actuatorId: UUID;
  deviceId: UUID;
  command: ActuatorCommandType;
  status: ActuatorCommandStatus;
  payload: string | null;
  createdAt: ISODateTime | null;
  sentAt: ISODateTime | null;
}
