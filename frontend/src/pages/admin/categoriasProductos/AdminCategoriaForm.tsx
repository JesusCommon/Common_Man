import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCrearCategoria, useActualizarCategoria, useObtenerCategoriaPorId } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Folder, ArrowLeft } from "lucide-react";
import type { CategoriaCreate } from "@/api/types";

interface CategoriaFormInnerProps {
  categoriaId?: string;
}

function CategoriaFormInner({ categoriaId }: CategoriaFormInnerProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(categoriaId);

  const crear = useCrearCategoria();
  const actualizar = useActualizarCategoria();
  const obtener = useObtenerCategoriaPorId(categoriaId ?? "");

  const [form, setForm] = useState<CategoriaCreate>(() => ({
    nombre: obtener.data?.nombre ?? "",
    descripcion: obtener.data?.descripcion ?? "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && categoriaId) {
      actualizar.mutate(
        { id: categoriaId, payload: form },
        { onSuccess: () => navigate("/admin/categoriasProductos") }
      );
    } else {
      crear.mutate(form, {
        onSuccess: () => navigate("/admin/categoriasProductos"),
      });
    }
  };

  const isPending = crear.isPending || actualizar.isPending;

  if (isEditing && obtener.isLoading) return <Spinner />;

  if (isEditing && obtener.isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/admin/categoriasProductos")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <ErrorAlert error={obtener.error} fallback="Error al cargar la categoría" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/categoriasProductos")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEditing
              ? "Modifica los datos de la categoría."
              : "Crea una nueva categoría para tus productos."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(value) => setForm({ ...form, nombre: value })}
            placeholder="Ej: Electrónica, Ropa, Hogar..."
            icon={Folder}
            required
            disabled={isPending}
          />

          <TextField
            label="Descripción"
            value={form.descripcion || ""}
            onChange={(value) => setForm({ ...form, descripcion: value })}
            placeholder="Breve descripción de la categoría..."
            multiline
            rows={4}
            disabled={isPending}
          />

          {isEditing && obtener.data && (
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Estado actual:</span>
              <StatusBadge active={obtener.data.activo} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/categoriasProductos")}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending || !form.nombre.trim()}
            >
              {isPending
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Categoría"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCategoriaForm() {
  const { id } = useParams<{ id: string }>();
  return <CategoriaFormInner key={id ?? "new"} categoriaId={id} />;
}