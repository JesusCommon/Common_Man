import type { EventoEnvioResponse } from "@/api/types";
import { getEstadoEnvioConfig, formatFecha } from "@/lib/estadosEnvio";

export function EnvioTimeline({ eventos }: { eventos: EventoEnvioResponse[] }) {
  if (eventos.length === 0) {
    return <p className="text-sm text-gray-500">Sin eventos registrados aún.</p>;
  }

  const ordenados = [...eventos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <ol className="relative ml-2 pl-5 space-y-4 border-l border-gray-200">
      {ordenados.map((evento, i) => {
        const config = getEstadoEnvioConfig(evento.estado);
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -left-6.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${config.dotClass}`}
            />
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-400">{formatFecha(evento.fecha)}</span>
            </div>
            {evento.descripcion && (
              <p className="text-xs text-gray-500 mt-1">{evento.descripcion}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}