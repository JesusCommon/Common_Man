import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCrearProducto,
  useActualizarProducto,
  useObtenerProductoPorIdAdmin,
  useListarCategoriasActivas,
  useActualizarImagenProducto,
  useEliminarImagenProducto,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { ProductoCreate, ProductoUpdate } from "@/api/types";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";

interface ProductoFormContentProps {
  initialData: {
    nombre: string;
    slug: string;
    descripcion?: string;
    descripcion_breve?: string;
    precio: number;
    stock: number;
    imagen?: string | null;
    categoria_id: string;
  } | null;
  isEdit: boolean;
  productoId?: string;
  onSubmit: (data: ProductoCreate | ProductoUpdate) => void;
  isPending: boolean;
  onCancel: () => void;
  categoriasOptions: { value: string; label: string }[];
}

function ProductoFormContent({
  initialData,
  isEdit,
  productoId,
  onSubmit,
  isPending,
  onCancel,
  categoriasOptions,
}: ProductoFormContentProps) {
  const actualizarImagen = useActualizarImagenProducto();
  const eliminarImagen = useEliminarImagenProducto();

  const [form, setForm] = useState<Omit<ProductoCreate, "imagen">>({
    nombre: initialData?.nombre ?? "",
    slug: initialData?.slug ?? "",
    descripcion: initialData?.descripcion ?? "",
    descripcion_breve: initialData?.descripcion_breve ?? "",
    precio: initialData?.precio ?? 0,
    stock: initialData?.stock ?? 0,
    categoria_id: initialData?.categoria_id ?? "",
  });

  const [mensajeImagen, setMensajeImagen] = useState<string | null>(null);

  const handleChange = (field: keyof Omit<ProductoCreate, "imagen">, value: string | number) => {
    setForm((prev) => {
      const newState = { ...prev, [field]: value };
      if (field === "nombre" && !isEdit) {
        newState.slug = String(value)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
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
        precio: Number(form.precio),
        stock: Number(form.stock),
        categoria_id: form.categoria_id,
      };
      onSubmit(updateData);
    } else {
      onSubmit({
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });
    }
  };

  const imagenBusy = actualizarImagen.isPending || eliminarImagen.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Nombre del producto"
          value={form.nombre}
          onChange={(v) => handleChange("nombre", v)}
          placeholder="Ej: Camiseta Negra"
          required
        />
        <TextField
          label="Slug (URL)"
          value={form.slug}
          onChange={(v) => handleChange("slug", v)}
          placeholder="camiseta-negra"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Precio"
          type="number"
          value={String(form.precio)}
          onChange={(v) => handleChange("precio", v)}
          placeholder="0"
          required
        />
        <TextField
          label="Stock inicial"
          type="number"
          value={String(form.stock)}
          onChange={(v) => handleChange("stock", v)}
          placeholder="0"
          required
        />
      </div>

      <Select
        label="Categoría"
        value={form.categoria_id}
        onChange={(v) => handleChange("categoria_id", v)}
        options={categoriasOptions}
        placeholder="Selecciona una categoría..."
        required
      />

      <TextField
        label="Descripción breve"
        value={form.descripcion_breve || ""}
        onChange={(v) => handleChange("descripcion_breve", v)}
        placeholder="Un resumen corto para tarjetas de producto..."
        multiline
        rows={3}
      />

      <TextField
        label="Descripción completa"
        value={form.descripcion || ""}
        onChange={(v) => handleChange("descripcion", v)}
        placeholder="Detalles completos del producto..."
        multiline
        rows={5}
      />

      <div>
        <ImageUpload
          currentImage={initialData?.imagen ?? null}
          onUpload={async (file) => {
            if (!productoId) {
              setMensajeImagen("Guarda el producto primero para subir la imagen.");
              return;
            }
            const resp = await actualizarImagen.mutateAsync({
              productoId,
              imagen: file,
            });
            setMensajeImagen(resp.mensaje);
          }}
          onDelete={async () => {
            if (!productoId) return;
            const resp = await eliminarImagen.mutateAsync(productoId);
            setMensajeImagen(resp.mensaje);
          }}
          isLoading={imagenBusy}
          maxSizeMB={5}
          aspectRatio="square"
          label="Imagen del producto"
        />
        {!productoId && (
          <p className="mt-1 text-xs text-amber-600">
            ⚠️ Crea el producto primero, luego podrás subir su imagen al editarlo.
          </p>
        )}
        {mensajeImagen && (
          <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700">{mensajeImagen}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
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

export default function AdminProductoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const obtener = useObtenerProductoPorIdAdmin(id ?? "");
  const categorias = useListarCategoriasActivas({ skip: 0, limit: 100 });

  const crear = useCrearProducto();
  const actualizar = useActualizarProducto();

  const isPending = isEdit ? actualizar.isPending : crear.isPending;

  const categoriasOptions =
    categorias.data?.items?.map((c) => ({
      value: c.id,
      label: c.nombre,
    })) ?? [];

  const handleSubmit = (data: ProductoCreate | ProductoUpdate) => {
    if (isEdit && id) {
      actualizar.mutate(
        { id, payload: data },
        { onSuccess: () => navigate("/admin/productos") }
      );
    } else {
      crear.mutate(data as ProductoCreate, {
        onSuccess: () => navigate("/admin/productos"),
      });
    }
  };

  if (isEdit && obtener.isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (isEdit && obtener.isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/admin/productos")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <ErrorAlert error={obtener.error} fallback="Producto no encontrado" />
      </div>
    );
  }

  if (categorias.isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/productos")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEdit
              ? "Actualiza la información del producto"
              : "Agrega un nuevo producto al catálogo"}
          </p>
        </div>
      </div>

      <ProductoFormContent
        key={isEdit ? `edit-${obtener.data?.id}` : "create"}
        initialData={obtener.data ?? null}
        isEdit={isEdit}
        productoId={obtener.data?.id}
        onSubmit={handleSubmit}
        isPending={isPending}
        onCancel={() => navigate("/admin/productos")}
        categoriasOptions={categoriasOptions}
      />
    </div>
  );
}