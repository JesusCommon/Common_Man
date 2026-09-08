import { useState } from "react";
import { useCrearDireccion, useActualizarDireccion } from "@/hooks";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { MapPin } from "lucide-react";
import type { DireccionResponse } from "@/api/types";

interface Props {
  direccion?: DireccionResponse | null;
  onClose: () => void;
}

export function DireccionFormModal({ direccion, onClose }: Props) {
  const isEdit = Boolean(direccion);

  const [form, setForm] = useState(() => ({
    alias: direccion?.alias ?? "",
    nombre_destinatario: direccion?.nombre_destinatario ?? "",
    telefono: direccion?.telefono ?? "",
    direccion: direccion?.direccion ?? "",
    complemento: direccion?.complemento ?? "",
    barrio: direccion?.barrio ?? "",
    ciudad: direccion?.ciudad ?? "",
    departamento: direccion?.departamento ?? "",
    codigo_postal: direccion?.codigo_postal ?? "",
    pais: direccion?.pais ?? "Colombia",
    referencias: direccion?.referencias ?? "",
    es_predeterminada: direccion?.es_predeterminada ?? false,
  }));

  const crear = useCrearDireccion();
  const actualizar = useActualizarDireccion();

  const isPending = crear.isPending || actualizar.isPending;
  const error = crear.error ?? actualizar.error;

  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      complemento: form.complemento || undefined,
      barrio: form.barrio || undefined,
      codigo_postal: form.codigo_postal || undefined,
      referencias: form.referencias || undefined,
    };

    if (isEdit && direccion) {
      const { es_predeterminada, ...updatePayload } = payload;
      actualizar.mutate({ id: direccion.id, payload: updatePayload }, { onSuccess: onClose });
    } else {
      crear.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? "Editar Dirección" : "Nueva Dirección"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <ErrorAlert
            error={error instanceof Error ? error : new Error(String(error))}
            fallback="No se pudo guardar la dirección."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Alias"
            value={form.alias}
            onChange={(v) => set("alias", v)}
            placeholder="Ej: Casa, Oficina..."
            icon={MapPin}
            required
            disabled={isPending}
          />
          <TextField
            label="Nombre del destinatario"
            value={form.nombre_destinatario}
            onChange={(v) => set("nombre_destinatario", v)}
            placeholder="Nombre y apellido"
            required
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Teléfono"
            value={form.telefono}
            onChange={(v) => set("telefono", v)}
            placeholder="Ej: 3122960908"
            required
            disabled={isPending}
          />
          <TextField
            label="Código postal"
            value={form.codigo_postal}
            onChange={(v) => set("codigo_postal", v)}
            placeholder="6 dígitos (opcional)"
            disabled={isPending}
          />
        </div>

        <TextField
          label="Dirección"
          value={form.direccion}
          onChange={(v) => set("direccion", v)}
          placeholder="Ej: Calle 123 # 45-67"
          required
          disabled={isPending}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Complemento"
            value={form.complemento}
            onChange={(v) => set("complemento", v)}
            placeholder="Apto, torre, piso..."
            disabled={isPending}
          />
          <TextField
            label="Barrio"
            value={form.barrio}
            onChange={(v) => set("barrio", v)}
            placeholder="Barrio (opcional)"
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Ciudad"
            value={form.ciudad}
            onChange={(v) => set("ciudad", v)}
            placeholder="Ej: Bogotá"
            required
            disabled={isPending}
          />
          <TextField
            label="Departamento"
            value={form.departamento}
            onChange={(v) => set("departamento", v)}
            placeholder="Ej: Cundinamarca"
            required
            disabled={isPending}
          />
        </div>

        <TextField
          label="Referencias"
          value={form.referencias}
          onChange={(v) => set("referencias", v)}
          placeholder="Indicaciones adicionales (opcional)"
          multiline
          rows={2}
          disabled={isPending}
        />

        {!isEdit && (
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={form.es_predeterminada}
              onChange={(e) => set("es_predeterminada", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isPending}
            />
            <span className="text-sm text-gray-700">Marcar como dirección predeterminada</span>
          </label>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || !form.alias || !form.nombre_destinatario || !form.telefono || !form.direccion || !form.ciudad || !form.departamento}
          >
            {isPending ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Dirección"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}