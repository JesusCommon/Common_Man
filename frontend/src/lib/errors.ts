export function extraerMensajeError(error: unknown): string {
  if (!error) return "Error desconocido.";
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const e = error as Record<string, unknown>;
    const response = e.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;

    if (typeof data?.detail === "string") return data.detail;

    if (Array.isArray(data?.detail)) {
      const mensajes = (data.detail as Array<Record<string, unknown>>)
        .map((d) => String(d.msg ?? d.message ?? ""))
        .filter(Boolean);
      if (mensajes.length > 0) return mensajes.join(", ");
    }

    if (typeof e.detail === "string") return e.detail;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error === "string") return e.error;
  }

  if (error instanceof Error) return error.message;
  return "Error desconocido.";
}