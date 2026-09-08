import { useState } from "react";
import { useListarMisEnvios } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Pagination } from "@/components/ui/Pagination";
import { EnvioTimeline } from "@/components/envios/EnvioTimeline";
import { Truck, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { getEstadoEnvioConfig, formatFecha } from "@/lib/estadosEnvio";
import type { EnvioResponse } from "@/api/types";

const PAGE_SIZE = 10;

function EnvioCard({ envio }: { envio: EnvioResponse }) {
  const [expandido, setExpandido] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = getEstadoEnvioConfig(envio.estado);

  const handleCopiar = () => {
    if (!envio.numero_seguimiento) return;
    navigator.clipboard.writeText(envio.numero_seguimiento).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Truck className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-mono text-sm text-gray-900">Envío {envio.id.slice(0, 8)}...</p>
            <p className="text-xs text-gray-500">Creado: {formatFecha(envio.fecha_creacion)}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.badgeClass}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Transportadora</p>
          <p className="font-medium text-gray-900 truncate">{envio.transportadora || "—"}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Seguimiento</p>
            {envio.numero_seguimiento && (
              <button type="button" onClick={handleCopiar} className="text-blue-600 hover:text-blue-700">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <p className="font-mono text-xs text-gray-900 truncate">
            {envio.numero_seguimiento || "—"}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Entrega estimada</p>
          <p className="font-medium text-gray-900">
            {formatFecha(envio.fecha_estimada_entrega)}
          </p>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expandido ? "Ocultar seguimiento" : "Ver seguimiento"}
        </button>

        {expandido && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <EnvioTimeline eventos={envio.eventos} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MisEnvios() {
  const [page, setPage] = useState(1);
  const query = useListarMisEnvios({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE });

  if (query.isLoading) return <Spinner />;
  if (query.isError) return <ErrorAlert error={query.error} fallback="Error al cargar tus envíos" />;

  const envios = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Envíos</h1>
        <p className="text-gray-500 text-sm">Sigue el estado de tus entregas.</p>
      </div>

      {envios.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center space-y-3">
          <Truck className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-sm">Aún no tienes envíos registrados.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {envios.map((e) => (
              <EnvioCard key={e.id} envio={e} />
            ))}
          </div>
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}