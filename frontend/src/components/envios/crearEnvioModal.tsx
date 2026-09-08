import { useState } from "react";
import {
  useListarComprasPorEstadoAdmin,
  useListarDireccionesDeUsuarioAdmin,
  useCrearEnvioAdmin,
  useListarTodosLosEnviosAdmin,
} from "@/hooks";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import type { CompraAdminResponse } from "@/api/types";

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

interface Props {
  onClose: () => void;
}

export function CrearEnvioModal({ onClose }: Props) {
  const [compraId, setCompraId] = useState("");
  const [direccionId, setDireccionId] = useState("");
  const [notas, setNotas] = useState("");

  const compras = useListarComprasPorEstadoAdmin({ estado: "pagado", skip: 0, limit: 100 });
  const envios = useListarTodosLosEnviosAdmin({ skip: 0, limit: 100 });
  
  const compraSeleccionada = compras.data?.items?.find(
    (c: CompraAdminResponse) => c.id === compraId
  );

  const direcciones = useListarDireccionesDeUsuarioAdmin(
    compraSeleccionada?.usuario_id ?? ""
  );
  
  const crear = useCrearEnvioAdmin();
  const comprasConEnvio = new Set(
    envios.data?.items?.map((e) => e.compra_id) ?? []
  );

  const comprasDisponibles =
    compras.data?.items?.filter((c: CompraAdminResponse) => !comprasConEnvio.has(c.id)) ?? [];

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

  if (compras.isLoading || envios.isLoading) return <Spinner />;

  return (
    <Modal isOpen={true} onClose={onClose} title="Crear Envío" size="lg">
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
            const compra = comprasDisponibles.find((c: CompraAdminResponse) => c.id === v);
            setDireccionId(compra?.direccion_id ?? "");
          }}
          options={comprasDisponibles.map((c: CompraAdminResponse) => ({
            value: c.id,
            label: `${c.numero_orden} · ${formatPrecio(c.total)}`,
          }))}
          placeholder={
            comprasDisponibles.length === 0
              ? "No hay compras pagadas sin envío"
              : "Selecciona una compra..."
          }
          required
          disabled={comprasDisponibles.length === 0}
        />

        {compraId && (
          direcciones.isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
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
          label="Notas para el envío"
          value={notas}
          onChange={setNotas}
          placeholder="Indicaciones adicionales (opcional)"
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
            disabled={crear.isPending || !compraId || !direccionId || comprasDisponibles.length === 0}
          >
            {crear.isPending ? "Creando..." : "Crear Envío"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}