import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCrearProducto,
  useActualizarProducto,
  useObtenerProductoPorIdAdmin,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import type { ProductoCreate, ProductoUpdate, ProductoAdminResponse } from "@/api/types";
import { ArrowLeft, Save } from "lucide-react";

// 1. Componente definido a nivel de módulo (NO dentro del render)
interface ProductoFormContentProps {
  initialData: ProductoAdminResponse | null;
  isEdit: boolean;
  onSubmit: (data: ProductoCreate | ProductoUpdate) => void;
  isPending: boolean;
  onCancel: () => void;
}

function ProductoFormContent({ initialData, isEdit, onSubmit, isPending, onCancel }: ProductoFormContentProps) {
  // 2. Nullish coalescing (?? "") garantiza que value sea siempre string, nunca undefined
  const [form, setForm] = useState<ProductoCreate>({
    nombre: initialData?.nombre ?? "",
    slug: initialData?.slug ?? "",
    descripcion: initialData?.descripcion ?? "",
    descripcion_breve: initialData?.descripcion_breve ?? "",
    precio: initialData?.precio ?? 0,
    stock: initialData?.stock ?? 0,
    imagen: initialData?.imagen ?? "",
    categoria_id: initialData?.categoria_id ?? "",
  });

  const handleChange = (field: keyof ProductoCreate, value: string) => {
    setForm((prev) => {
      const newState = { ...prev, [field]: value };
      if (field === "nombre" && !isEdit) {
        newState.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      const updateData: ProductoUpdate = {
        nombre: form.nombre,
        slug: form.slug,
        descripcion: form.descripcion || undefined,
        descripcion_breve: form.descripcion_breve || undefined,
        precio: form.precio,
        stock: form.stock,
        imagen: form.imagen || undefined,
        categoria_id: form.categoria_id,
      };
      onSubmit(updateData);
    } else {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Nombre del producto"
          value={form.nombre}
          onChange={(v) => handleChange("nombre", v)}
          placeholder="Ej: Camiseta Negra"
        />
        <TextField
          label="Slug (URL)"
          value={form.slug}
          onChange={(v) => handleChange("slug", v)}
          placeholder="camiseta-negra"
          mono
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Precio"
          type="number"
          value={String(form.precio)} // Convertido a string para TextField
          onChange={(v) => handleChange("precio", v)}
          placeholder="0.00"
        />
        <TextField
          label="Stock inicial"
          type="number"
          value={String(form.stock)}
          onChange={(v) => handleChange("stock", v)}
          placeholder="0"
        />
      </div>

      <TextField
        label="ID de Categoría"
        value={form.categoria_id}
        onChange={(v) => handleChange("categoria_id", v)}
        placeholder="Pega el ID de la categoría aquí"
        mono
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Descripción breve</label>
        <textarea
          value={form.descripcion_breve}
          onChange={(e) => handleChange("descripcion_breve", e.target.value)}
          className="w-full h-20 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          placeholder="Un resumen corto para tarjetas de producto..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Descripción completa</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          placeholder="Detalles completos del producto..."
        />
      </div>

      <TextField
        label="URL de la imagen"
        value={form.imagen}
        onChange={(v) => handleChange("imagen", v)}
        placeholder="https://ejemplo.com/imagen.jpg"
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isPending || !form.nombre || !form.categoria_id}
        >
          {isPending ? <Spinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
          {isEdit ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}

// 3. Componente Principal (Orquestador)
export default function AdminProductoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: productoExistente, isLoading, error: fetchError } = useObtenerProductoPorIdAdmin(isEdit ? id! : undefined);
  
  const crear = useCrearProducto();
  const actualizar = useActualizarProducto();
  
  const isPending = isEdit ? actualizar.isPending : crear.isPending;
  const error = isEdit ? actualizar.error : crear.error;

  if (isEdit && isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (isEdit && !productoExistente) {
    return <ErrorAlert error={fetchError || new Error("No encontrado")} fallback="Producto no encontrado" />;
  }

  const handleSubmit = (data: ProductoCreate | ProductoUpdate) => {
    if (isEdit && id) {
      actualizar.mutate({ id, payload: data }, { onSuccess: () => navigate("/admin/productos") });
    } else {
      crear.mutate(data as ProductoCreate, { onSuccess: () => navigate("/admin/productos") });
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/productos")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h1>
          <p className="text-slate-500 text-sm">
            {isEdit ? "Actualiza la información del producto" : "Agrega un nuevo producto al catálogo"}
          </p>
        </div>
      </div>

      {error && (
        <ErrorAlert 
          error={error instanceof Error ? error : new Error("Error desconocido")} 
          fallback="Error al guardar el producto." 
        />
      )}

      {/* 4. La key se aplica al componente externo. Esto reinicia su estado interno limpiamente sin violar reglas de React. */}
      <ProductoFormContent
        key={isEdit ? `edit-${productoExistente?.id}` : "create"}
        initialData={productoExistente ?? null}
        isEdit={isEdit}
        onSubmit={handleSubmit}
        isPending={isPending}
        onCancel={() => navigate("/admin/productos")}
      />
    </div>
  );
}