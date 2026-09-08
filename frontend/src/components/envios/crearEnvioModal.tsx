import { useState } from "react";
import {
  useListarComprasPorEstadoAdmin,
  useListarDireccionesDeUsuarioAdmin,
  useCrearEnvioAdmin,
} from "@/hooks";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

interface Props {
  onClose: () => void;
}

export function CrearEnvioModal({ onClose }: Props) {
  const [compraId, setCompraId] = useState("");
  const [direccionId, setDireccionId] = useState("");
  const [notas, setNotas] = useState("");
  const compras = useListarComprasPorEstadoAdmin({ estado: "pagado", skip: 0, limit: 100 });
  const compraSeleccionada = compras.data?.items?.find((c) => c.id === compraId);
  const direcciones = useListarDireccionesDeUsuarioAdmin(
    compraSeleccionada?.usuario_id ?? ""
  );
  const crear = useCrearEnvioAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(
      {
        compra_id: compraId,
        direccion_id: direccionId,
        notas: notas || undefined,
      },
      { onSuccess: onClose }
    );
  };

  if (compras.isLoading) return <Spinner />;

  return (
    <Modal isOpen={true} onClose={onClose} title="Crear Envío">
      <form onSubmit={handleSubmit} className="space-y-4">
        {crear.isError && (
          <ErrorAlert
            error={crear.error instanceof Error ? crear.error : new Error(String(crear.error))}
            fallback="No se pudo crear el envío."
          />
        )}

        <Select
          label="Compra"
          value={compraId}
          onChange={(v) => {
            setCompraId(v);
            setDireccionId("");
          }}
          options={
            compras.data?.items?.map((c) => ({
              value: c.id,
              label: `${c.numero_orden} · ${c.estado}`,
            })) ?? []
          }
          placeholder="Selecciona una compra..."
          required
        />

        {compraId && (
          direcciones.isLoading ? (
            <Spinner />
          ) : (
            <Select
              label="Dirección de entrega"
              value={direccionId}
              onChange={setDireccionId}
              options={
                direcciones.data?.items?.map((d) => ({
                  value: d.id,
                  label: `${d.alias} — ${d.ciudad}${d.es_predeterminada ? " (predeterminada)" : ""}`,
                })) ?? []
              }
              placeholder="Selecciona una dirección..."
              required
            />
          )
        )}

        <TextField
          label="Notas"
          value={notas}
          onChange={setNotas}
          placeholder="Indicaciones para el envío (opcional)"
          multiline
          rows={3}
          disabled={crear.isPending}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={crear.isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={crear.isPending || !compraId || !direccionId}
          >
            {crear.isPending ? "Creando..." : "Crear Envío"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}