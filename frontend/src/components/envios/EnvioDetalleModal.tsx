import { useState } from "react";
import {
  useActualizarEnvioAdmin,
  useActualizarEstadoEnvioAdmin,
} from "@/hooks";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { EnvioTimeline } from "./EnvioTimeline";
import { Copy, Check, Truck } from "lucide-react";
import { ESTADOS_ENVIO, getEstadoEnvioConfig, formatFecha } from "@/lib/estadosEnvio";
import type { EnvioAdminResponse } from "@/api/types";

interface Props {
  envio: EnvioAdminResponse;
  isAdmin?: boolean;
  onClose: () => void;
}

export function EnvioDetalleModal({ envio, isAdmin = false, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const [nuevoEstado, setNuevoEstado] = useState(envio.estado);
  const [descripcionEstado, setDescripcionEstado] = useState("");
  const [transportadora, setTransportadora] = useState(envio.transportadora ?? "");
  const [seguimiento, setSeguimiento] = useState(envio.numero_seguimiento ?? "");
  const [fechaEstimada, setFechaEstimada] = useState(
    envio.fecha_estimada_entrega ? envio.fecha_estimada_entrega.slice(0, 16) : ""
  );

  const actualizarEstado = useActualizarEstadoEnvioAdmin();
  const actualizarDatos = useActualizarEnvioAdmin();

  const config = getEstadoEnvioConfig(envio.estado);
  const error = actualizarEstado.error ?? actualizarDatos.error;

  const handleCopiar = () => {
    if (!envio.numero_seguimiento) return;
    navigator.clipboard.writeText(envio.numero_seguimiento).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleActualizarEstado = () => {
    actualizarEstado.mutate(
      {
        id: envio.id,
        payload: {
          estado: nuevoEstado,
          descripcion: descripcionEstado || undefined,
        },
      },
      { onSuccess: onClose }
    );
  };

  const handleActualizarTracking = () => {
    actualizarDatos.mutate(
      {
        id: envio.id,
        payload: {
          transportadora: transportadora || undefined,
          numero_seguimiento: seguimiento || undefined,
          fecha_estimada_entrega: fechaEstimada || undefined,
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Envío ${envio.id.slice(0, 8)}...`}>
      <div className="space-y-5">
        {error && (
          <ErrorAlert
            error={error instanceof Error ? error : new Error(String(error))}
            fallback="No se pudo completar la acción."
          />
        )}

        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${config.badgeClass}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-400">Creado: {formatFecha(envio.fecha_creacion)}</span>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500">
              <Truck className="w-4 h-4" /> Seguimiento
            </span>
            {envio.numero_seguimiento && (
              <button
                type="button"
                onClick={handleCopiar}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-800 font-mono">
            {envio.numero_seguimiento || "Sin número de seguimiento"}
          </p>
          <p className="text-xs text-gray-500">
            Transportadora: {envio.transportadora || "—"} · Entrega estimada:{" "}
            {formatFecha(envio.fecha_estimada_entrega)}
          </p>
          {envio.fecha_entrega_real && (
            <p className="text-xs text-emerald-600 font-medium">
              Entregado: {formatFecha(envio.fecha_entrega_real)}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de eventos</h3>
          <EnvioTimeline eventos={envio.eventos} />
        </div>

        {isAdmin && (
          <>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Cambiar estado</h3>
              <Select
                value={nuevoEstado}
                onChange={(v) => setNuevoEstado(v as typeof nuevoEstado)}
                options={ESTADOS_ENVIO.map((e) => ({ value: e.value, label: e.label }))}
              />
              <TextField
                label="Descripción del cambio"
                value={descripcionEstado}
                onChange={setDescripcionEstado}
                placeholder="Opcional..."
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleActualizarEstado}
                disabled={actualizarEstado.isPending}
              >
                {actualizarEstado.isPending ? "Actualizando..." : "Actualizar Estado"}
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Datos de envío</h3>
              <TextField
                label="Transportadora"
                value={transportadora}
                onChange={setTransportadora}
                placeholder="Ej: Servientrega"
              />
              <TextField
                label="Número de seguimiento"
                value={seguimiento}
                onChange={setSeguimiento}
                placeholder="Ej: SV-123456789"
              />
              <TextField
                label="Fecha estimada de entrega"
                type="datetime-local"
                value={fechaEstimada}
                onChange={setFechaEstimada}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleActualizarTracking}
                disabled={actualizarDatos.isPending}
              >
                {actualizarDatos.isPending ? "Guardando..." : "Guardar Tracking"}
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}