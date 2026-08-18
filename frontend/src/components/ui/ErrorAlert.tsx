import { Alert } from "./Alert";

interface ErrorAlertProps {
  error: unknown;
  fallback?: string;
}

export function ErrorAlert({ error, fallback = "Error al cargar los datos" }: ErrorAlertProps) {
  const message = error instanceof Error ? error.message : fallback;
  return <Alert variant="error" message={message} />;
}