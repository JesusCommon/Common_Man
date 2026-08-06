import type { AxiosError } from "axios";
import type { ZodError, ZodIssue } from "zod";

export interface ServiceError {
  code: "VALIDATION" | "AUTH" | "FORBIDDEN" | "NOT_FOUND" | "NETWORK" | "UNKNOWN" | "CONFLICT";
  message: string;
  details?: string;
  fieldErrors?: Record<string, string[]>;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

export function validationError(zodError: ZodError): ServiceError {
  const fieldErrors: Record<string, string[]> = {};

  zodError.issues.forEach((issue: ZodIssue) => {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  });

  return {
    code: "VALIDATION",
    message: "Algunos campos no son válidos. Revísalos e intenta de nuevo.",
    fieldErrors,
  };
}

export function networkError(axError?: AxiosError): ServiceError {
  const status = axError?.response?.status;

  if (status === 401) {
    return { code: "AUTH", message: "Sesión expirada. Inicia sesión de nuevo." };
  }
  if (status === 403) {
    return { code: "FORBIDDEN", message: "No tienes permisos para realizar esta acción." };
  }
  if (status === 404) {
    return { code: "NOT_FOUND", message: "El recurso solicitado no existe." };
  }
  if (status === 409) {
    return { code: "CONFLICT", message: "Ya existe un registro con esos datos." };
  }
  if (status === 422) {
    return { code: "VALIDATION", message: "Los datos enviados no cumplen las reglas del servidor." };
  }
  if (!axError?.response) {
    return { code: "NETWORK", message: "Error de conexión. Verifica tu internet." };
  }

  return {
    code: "UNKNOWN",
    message: "Ocurrió un error inesperado. Intenta más tarde.",
    details: axError.message,
  };
}