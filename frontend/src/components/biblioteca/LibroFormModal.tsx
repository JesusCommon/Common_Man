import { useEffect, useRef, useState } from "react";
import {
  useCrearLibro,
  useActualizarLibro,
  useAutoresPublicos,
  useEditorialesPublicas,
  useGenerosPublicos,
} from "@/hooks";
import { X } from "lucide-react";
import type { Idiomas, LibroAdminResponse } from "@/api/types";
import { extraerMensajeError } from "@/lib/errors";

interface LibroFormModalProps {
  abierto: boolean;
  libro: LibroAdminResponse | null;
  onClose: () => void;
}

interface LibroForm {
  nombre: string;
  autor_id: string;
  editorial_id: string;
  genero_id: string;
  edicion: string;
  anio_publicacion: string;
  paginas: string;
  idioma: Idiomas;
  portada: string;
  isbn: string;
  sku: string;
  precio: string;
  stock: string;
  descripcion: string;
  contenido: string;
}

const IDIOMAS: Idiomas[] = ["Español", "Ingles", "Portugues"];

function formVacio(): LibroForm {
  return {
    nombre: "",
    autor_id: "",
    editorial_id: "",
    genero_id: "",
    edicion: "",
    anio_publicacion: String(new Date().getFullYear()),
    paginas: "",
    idioma: "Español",
    portada: "",
    isbn: "",
    sku: "",
    precio: "",
    stock: "0",
    descripcion: "",
    contenido: "",
  };
}

function desdeLibro(l: LibroAdminResponse): LibroForm {
  return {
    nombre: l.nombre,
    autor_id: l.autor_id,
    editorial_id: l.editorial_id,
    genero_id: l.genero_id,
    edicion: l.edicion ?? "",
    anio_publicacion: String(l.anio_publicacion),
    paginas: String(l.paginas),
    idioma: l.idioma,
    portada: l.portada ?? "",
    isbn: l.isbn ?? "",
    sku: l.sku ?? "",
    precio: String(l.precio),
    stock: String(l.stock),
    descripcion: l.descripcion ?? "",
    contenido: String(l.contenido),
  };
}

const inputCls =
  "w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]";

export function LibroFormModal({ abierto, libro, onClose }: LibroFormModalProps) {
  const crear = useCrearLibro();
  const actualizar = useActualizarLibro();

  const { data: autores } = useAutoresPublicos();
  const { data: editoriales } = useEditorialesPublicas();
  const { data: generos } = useGenerosPublicos();

  const [form, setForm] = useState<LibroForm>(formVacio);

  const prevId = useRef(libro?.id);
  useEffect(() => {
    if (libro?.id !== prevId.current) {
      setForm(libro ? desdeLibro(libro) : formVacio());
      prevId.current = libro?.id;
    }
  }, [libro]);

  const isPending = crear.isPending || actualizar.isPending;
  const error = crear.error || actualizar.error;

  function set<K extends keyof LibroForm>(key: K, value: LibroForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nombre: form.nombre,
      autor_id: form.autor_id,
      editorial_id: form.editorial_id,
      genero_id: form.genero_id,
      edicion: form.edicion.trim() || undefined,
      anio_publicacion: Number(form.anio_publicacion),
      paginas: Number(form.paginas),
      idioma: form.idioma,
      portada: form.portada.trim() || undefined,
      isbn: form.isbn.trim() || undefined,
      sku: form.sku.trim() || undefined,
      precio: Number(form.precio),
      stock: Number(form.stock),
      descripcion: form.descripcion.trim() || undefined,
      contenido: form.contenido.trim(),
    };

    if (libro) {
      actualizar.mutate({ id: libro.id, data: payload }, { onSuccess: onClose });
    } else {
      crear.mutate(payload, { onSuccess: onClose });
    }
  }

  const requeridosOk =
    form.nombre.trim() &&
    form.autor_id &&
    form.editorial_id &&
    form.genero_id &&
    form.contenido.trim() &&
    Number(form.precio) > 0;

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#18181B]">
            {libro ? "Editar libro" : "Nuevo libro"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4F4F5] text-[#A1A19A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                maxLength={150}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Autor <span className="text-red-500">*</span>
              </label>
              <select
                value={form.autor_id}
                onChange={(e) => set("autor_id", e.target.value)}
                className={inputCls}
              >
                <option value="">Selecciona...</option>
                {autores?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} {a.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Editorial <span className="text-red-500">*</span>
              </label>
              <select
                value={form.editorial_id}
                onChange={(e) => set("editorial_id", e.target.value)}
                className={inputCls}
              >
                <option value="">Selecciona...</option>
                {editoriales?.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Género <span className="text-red-500">*</span>
              </label>
              <select
                value={form.genero_id}
                onChange={(e) => set("genero_id", e.target.value)}
                className={inputCls}
              >
                <option value="">Selecciona...</option>
                {generos?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Idioma
              </label>
              <select
                value={form.idioma}
                onChange={(e) => set("idioma", e.target.value as Idiomas)}
                className={inputCls}
              >
                {IDIOMAS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Edición <span className="font-normal text-[#A1A19A]">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.edicion}
                onChange={(e) => set("edicion", e.target.value)}
                maxLength={100}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Año de publicación <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.anio_publicacion}
                onChange={(e) => set("anio_publicacion", e.target.value)}
                min={1000}
                max={2100}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Páginas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.paginas}
                onChange={(e) => set("paginas", e.target.value)}
                min={1}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => set("precio", e.target.value)}
                min={0}
                step="0.01"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                min={0}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                ISBN <span className="font-normal text-[#A1A19A]">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => set("isbn", e.target.value)}
                placeholder="978-3-16-148410-0"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                SKU <span className="font-normal text-[#A1A19A]">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="LIB-0001"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                URL de portada <span className="font-normal text-[#A1A19A]">(opcional)</span>
              </label>
              <input
                type="url"
                value={form.portada}
                onChange={(e) => set("portada", e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                URL de contenido <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={form.contenido}
                onChange={(e) => set("contenido", e.target.value)}
                placeholder="https://.../libro.pdf"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-[#A1A19A]">
                🔒 Este contenido solo se libera a quienes compren el libro.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                Descripción <span className="font-normal text-[#A1A19A]">(opcional)</span>
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                rows={3}
                maxLength={1000}
                className={`${inputCls} resize-none`}
              />
              <p className="mt-1 text-xs text-[#A1A19A] text-right">
                {form.descripcion.length}/1000
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{extraerMensajeError(error)}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E4E4E1] px-4 py-2 text-sm font-medium text-[#52525B] hover:bg-[#FAFAF8] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !requeridosOk}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition disabled:opacity-50"
            >
              {isPending ? "Guardando..." : libro ? "Guardar cambios" : "Crear libro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}