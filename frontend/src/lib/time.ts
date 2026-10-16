export function formatHora(iso: string | null | undefined): string {
  if (!iso) return "";
  const fecha = new Date(iso);
  const ahora = new Date();
  const esHoy = fecha.toDateString() === ahora.toDateString();

  if (esHoy) {
    return fecha.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }
  return fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}