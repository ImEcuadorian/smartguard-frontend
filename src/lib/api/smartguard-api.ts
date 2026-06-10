import { api } from "./http";
import type {
  AccessEventResponse,
  AccessReaderResponse,
  ActuatorCommandResponse,
  ActuatorCommandType,
  ActuatorResponse,
  AlertResponse,
  AlertSeverity,
  AlertStatus,
  AlertType,
  AuthResponse,
  ComparisonOperator,
  DeviceRegistrationResponse,
  DeviceResponse,
  DeviceStatus,
  SensorAlertRuleResponse,
  SensorAlertRuleType,
  SensorReadingResponse,
  SensorResponse,
  SensorStatus,
  SensorType,
  UserAccountResponse,
  UserRole,
  UserStatus,
  UUID,
} from "./types";

export const authApi = {
  bootstrapAdmin: (body: {
    username: string;
    password: string;
    displayName: string;
  }) =>
    api
      .post<AuthResponse>("/api/v1/auth/bootstrap-admin", body)
      .then((response) => response.data),

  login: (body: { username: string; password: string }) =>
    api
      .post<AuthResponse>("/api/v1/auth/login", body)
      .then((response) => response.data),

  refresh: (refreshToken: string) =>
    api
      .post<AuthResponse>("/api/v1/auth/refresh", { refreshToken })
      .then((response) => response.data),

  logout: (refreshToken: string) =>
    api
      .post<void>("/api/v1/auth/logout", { refreshToken })
      .then((response) => response.data),

  me: () =>
    api
      .get<UserAccountResponse>("/api/v1/auth/me")
      .then((response) => response.data),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api
      .patch<UserAccountResponse>("/api/v1/auth/me/password", body)
      .then((response) => response.data),
};

export const userApi = {
  create: (body: {
    username: string;
    password: string;
    displayName: string;
    role: UserRole;
  }) =>
    api
      .post<UserAccountResponse>("/api/v1/users", body)
      .then((response) => response.data),

  list: () =>
    api.get<UserAccountResponse[]>("/api/v1/users").then((response) => response.data),

  updateStatus: (id: UUID, status: UserStatus) =>
    api
      .patch<UserAccountResponse>(`/api/v1/users/${id}/status`, { status })
      .then((response) => response.data),
};

export const deviceApi = {
  create: (body: {
    code: string;
    name: string;
    location?: string | null;
    ipAddress?: string | null;
    firmwareVersion?: string | null;
  }) =>
    api
      .post<DeviceRegistrationResponse>("/api/v1/devices", body)
      .then((response) => response.data),

  list: (params?: { status?: DeviceStatus }) =>
    api
      .get<DeviceResponse[]>("/api/v1/devices", { params })
      .then((response) => response.data),

  get: (id: UUID) =>
    api.get<DeviceResponse>(`/api/v1/devices/${id}`).then((response) => response.data),

  update: (
    id: UUID,
    body: Partial<{
      code: string;
      name: string;
      location: string | null;
      ipAddress: string | null;
      firmwareVersion: string | null;
    }>,
  ) =>
    api.patch<DeviceResponse>(`/api/v1/devices/${id}`, body).then((response) => response.data),

  updateStatus: (id: UUID, status: DeviceStatus) =>
    api
      .patch<DeviceResponse>(`/api/v1/devices/${id}/status`, { status })
      .then((response) => response.data),
};

export const sensorApi = {
  create: (body: {
    deviceId: UUID;
    code: string;
    name: string;
    type: SensorType;
    unit?: string | null;
    location?: string | null;
  }) =>
    api
      .post<SensorResponse>("/api/v1/sensors", body)
      .then((response) => response.data),

  list: (params?: { deviceId?: UUID; status?: SensorStatus; type?: SensorType }) =>
    api
      .get<SensorResponse[]>("/api/v1/sensors", { params })
      .then((response) => response.data),

  get: (id: UUID) =>
    api.get<SensorResponse>(`/api/v1/sensors/${id}`).then((response) => response.data),

  updateStatus: (id: UUID, status: SensorStatus) =>
    api
      .patch<SensorResponse>(`/api/v1/sensors/${id}/status`, { status })
      .then((response) => response.data),

  createReading: (
    id: UUID,
    body: {
      numericValue?: number | null;
      booleanValue?: boolean | null;
      textValue?: string | null;
      recordedAt?: string | null;
    },
  ) =>
    api
      .post<SensorReadingResponse>(`/api/v1/sensors/${id}/readings`, body)
      .then((response) => response.data),

  readings: (id: UUID, params?: { from?: string; to?: string; limit?: number }) =>
    api
      .get<SensorReadingResponse[]>(`/api/v1/sensors/${id}/readings`, { params })
      .then((response) => response.data),

  latestReading: (id: UUID) =>
    api
      .get<SensorReadingResponse>(`/api/v1/sensors/${id}/readings/latest`)
      .then((response) => response.data),

  createRule: (
    id: UUID,
    body: {
      type: SensorAlertRuleType;
      operator?: ComparisonOperator | null;
      thresholdValue?: number | null;
      expectedBooleanValue?: boolean | null;
      durationMinutes?: number | null;
      alertType: AlertType;
      severity: AlertSeverity;
      message: string;
    },
  ) =>
    api
      .post<SensorAlertRuleResponse>(`/api/v1/sensors/${id}/alert-rules`, body)
      .then((response) => response.data),

  rules: (id: UUID) =>
    api
      .get<SensorAlertRuleResponse[]>(`/api/v1/sensors/${id}/alert-rules`)
      .then((response) => response.data),

  disableRule: (ruleId: UUID) =>
    api
      .patch<SensorAlertRuleResponse>(`/api/v1/sensor-alert-rules/${ruleId}/disable`)
      .then((response) => response.data),
};

export const alertApi = {
  list: (params?: { status?: AlertStatus; severity?: AlertSeverity }) =>
    api
      .get<AlertResponse[]>("/api/v1/alerts", { params })
      .then((response) => response.data),

  acknowledge: (id: UUID) =>
    api
      .patch<AlertResponse>(`/api/v1/alerts/${id}/acknowledge`)
      .then((response) => response.data),

  resolve: (id: UUID) =>
    api
      .patch<AlertResponse>(`/api/v1/alerts/${id}/resolve`)
      .then((response) => response.data),
};

export const accessApi = {
  readers: () =>
    api
      .get<AccessReaderResponse[]>("/api/v1/access/readers")
      .then((response) => response.data),

  events: (params?: { from?: string; to?: string; limit?: number }) =>
    api
      .get<AccessEventResponse[]>("/api/v1/access/events", { params })
      .then((response) => response.data),
};

export const actuatorApi = {
  list: () =>
    api.get<ActuatorResponse[]>("/api/v1/actuators").then((response) => response.data),

  sendCommand: (id: UUID, command: ActuatorCommandType, payload?: string | null) =>
    api
      .post<ActuatorCommandResponse>(`/api/v1/actuators/${id}/commands`, {
        command,
        payload,
      })
      .then((response) => response.data),

  commands: (id: UUID) =>
    api
      .get<ActuatorCommandResponse[]>(`/api/v1/actuators/${id}/commands`)
      .then((response) => response.data),
};
