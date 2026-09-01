import { useState } from "react";
import { useActualizarCategoria } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Folder } from "lucide-react";
import type { CategoriaResponse, CategoriaUpdate } from "@/api/types";

interface Props {
  categoria: CategoriaResponse;
  onClose: () => void;
}

export function CategoriaDetalleModal({ categoria, onClose }: Props) {
  const [form, setForm] = useState<CategoriaUpdate>({
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || "",
  });

  const actualizar = useActualizarCategoria();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizar.mutate(
      { id: categoria.id, payload: form },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Editar Categoría"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Nombre"
          value={form.nombre || ""}
          onChange={(value) => setForm({ ...form, nombre: value })}
          placeholder="Ej: Electrónica"
          icon={Folder}
          required
          disabled={actualizar.isPending}
        />

        <TextField
          label="Descripción"
          value={form.descripcion || ""}
          onChange={(value) => setForm({ ...form, descripcion: value })}
          placeholder="Breve descripción de la categoría..."
          multiline
          rows={4}
          disabled={actualizar.isPending}
        />

        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Estado actual:</span>
          <StatusBadge active={categoria.activo} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={actualizar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={actualizar.isPending || !form.nombre?.trim()}
          >
            {actualizar.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}