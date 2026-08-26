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

interface ApiErrorData {
  detail?: string | Array<{ msg: string; loc?: string[] }>;
  message?: string;
  error?: string;
}

export function networkError(axError?: AxiosError): ServiceError {
  const data = axError?.response?.data as ApiErrorData | undefined;
  const status = axError?.response?.status;

  if (data?.detail) {
    const message = typeof data.detail === "string" 
      ? data.detail 
      : Array.isArray(data.detail) 
        ? data.detail.map((d) => d.msg).join(", ")
        : "Error en los datos enviados";

    let code: ServiceError["code"] = "UNKNOWN";
    if (status === 401) code = "AUTH";
    else if (status === 403) code = "FORBIDDEN";
    else if (status === 404) code = "NOT_FOUND";
    else if (status === 409) code = "CONFLICT";
    else if (status === 422) code = "VALIDATION";

    return { 
      code, 
      message, 
      details: JSON.stringify(data)
    };
  }

  if (status === 401) {
    return { code: "AUTH", message: "Credenciales incorrectas o sesión expirada." };
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
    return { 
      code: "NETWORK", 
      message: "Error de conexión. Verifica tu internet o que el servidor esté activo." 
    };
  }

  return {
    code: "UNKNOWN",
    message: "Ocurrió un error inesperado. Intenta más tarde.",
    details: axError?.message,
  };
}