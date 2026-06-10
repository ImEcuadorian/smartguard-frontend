import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuthSession,
  getAuthSession,
  storeAuthSession,
} from "@/lib/auth/auth-storage";
import type { ApiErrorResponse, AuthResponse } from "./types";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export class ApiError extends Error {
  constructor(
      message: string,
      public status: number,
      public validation?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

let refreshRequest: Promise<AuthResponse> | null = null;

async function refreshSession() {
  const session = getAuthSession();

  if (!session?.refreshToken) {
    throw new ApiError("Sesión expirada", 401);
  }

  refreshRequest ??= axios
      .post<AuthResponse>(`${apiUrl}/api/v1/auth/refresh`, {
        refreshToken: session.refreshToken,
      })
      .then((response) => {
        storeAuthSession(response.data);
        return response.data;
      })
      .finally(() => {
        refreshRequest = null;
      });

  return refreshRequest;
}

function toApiError(error: AxiosError<ApiErrorResponse>) {
  const data = error.response?.data;

  return new ApiError(
      data?.message ?? error.message ?? "No se pudo completar la solicitud",
      error.response?.status ?? 0,
      data?.validation,
  );
}

api.interceptors.request.use((config) => {
  const session = getAuthSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined;
      const requestUrl = originalRequest?.url ?? "";

      const isAuthRequest =
          requestUrl.includes("/api/v1/auth/login") ||
          requestUrl.includes("/api/v1/auth/refresh") ||
          requestUrl.includes("/api/v1/auth/logout");

      if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isAuthRequest
      ) {
        originalRequest._retry = true;

        try {
          const refreshed = await refreshSession();
          originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
          return api(originalRequest);
        } catch {
          /*
            IMPORTANTE:
            No redirigimos automáticamente aquí porque si un endpoint del dashboard
            falla con 401, el frontend estaba limpiando la sesión y mandando al login.
            Mejor lanzamos el error para verlo en pantalla o en consola.
          */
          throw new ApiError("No se pudo renovar la sesión", 401);
        }
      }

      if (error.response?.status === 401 && isAuthRequest) {
        clearAuthSession();
      }

      throw toApiError(error);
    },
);