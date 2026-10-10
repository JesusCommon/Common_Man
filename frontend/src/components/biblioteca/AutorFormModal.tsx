import { useEffect, useRef, useState } from "react";
import {
  useCrearAutor,
  useActualizarAutor,
  useActualizarImagenAutor,
  useEliminarImagenAutor,
} from "@/hooks";
import { X, CheckCircle2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { AutorResponse } from "@/api/types";
import { extraerMensajeError } from "@/lib/errors";

interface AutorFormModalProps {
  abierto: boolean;
  autor: AutorResponse | null;
  onClose: () => void;
}

export function AutorFormModal({ abierto, autor, onClose }: AutorFormModalProps) {
  const crear = useCrearAutor();
  const actualizar = useActualizarAutor();
  const actualizarImagen = useActualizarImagenAutor();
  const eliminarImagen = useEliminarImagenAutor();

  const [nombre, setNombre] = useState(autor?.nombre ?? "");
  const [apellido, setApellido] = useState(autor?.apellido ?? "");
  const [pais, setPais] = useState(autor?.pais_nacimiento ?? "");
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const prevAutorId = useRef(autor?.id);
  useEffect(() => {
    if (autor?.id !== prevAutorId.current) {
      setNombre(autor?.nombre ?? "");
      setApellido(autor?.apellido ?? "");
      setPais(autor?.pais_nacimiento ?? "");
      setMensajeExito(null);
      prevAutorId.current = autor?.id;
    }
  }, [autor]);

  const isPending =
    crear.isPending ||
    actualizar.isPending ||
    actualizarImagen.isPending ||
    eliminarImagen.isPending;
  const error =
    crear.error || actualizar.error || actualizarImagen.error || eliminarImagen.error;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensajeExito(null);

    const payload = {
      nombre,
      apellido,
      pais_nacimiento: pais.trim() ? pais.trim() : undefined,
    };

    try {
      if (autor) {
        const resp = await actualizar.mutateAsync({ id: autor.id, data: payload });
        setMensajeExito(resp.mensaje);
      } else {
        const resp = await crear.mutateAsync(payload);
        setMensajeExito(resp.mensaje);
      }
      setTimeout(() => onClose(), 1500);
    } catch {
      // El error se renderiza vía el estado `error`
    }
  }

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {autor ? "Editar autor" : "Nuevo autor"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              País de nacimiento{" "}
              <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <ImageUpload
            currentImage={autor?.imagen ?? null}
            onUpload={async (file) => {
              if (!autor) {
                setMensajeExito("Crea el autor primero para subir su imagen.");
                return;
              }
              const resp = await actualizarImagen.mutateAsync({
                autorId: autor.id,
                imagen: file,
              });
              setMensajeExito(resp.mensaje);
            }}
            onDelete={async () => {
              if (!autor) return;
              const resp = await eliminarImagen.mutateAsync(autor.id);
              setMensajeExito(resp.mensaje);
            }}
            isLoading={actualizarImagen.isPending || eliminarImagen.isPending}
            maxSizeMB={5}
            aspectRatio="square"
            label="Foto del autor"
          />
          {!autor && (
            <p className="text-xs text-amber-600">
              ⚠️ Crea el autor primero, luego podrás subir su imagen al editarlo.
            </p>
          )}
          <p className="text-xs text-gray-500">
            Se muestra como avatar en la sección "Voces destacadas" de la biblioteca.
          </p>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{extraerMensajeError(error)}</p>
            </div>
          )}

          {mensajeExito && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-700">{mensajeExito}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !nombre.trim() || !apellido.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isPending
                ? actualizarImagen.isPending
                  ? "Subiendo imagen..."
                  : "Guardando..."
                : autor
                ? "Guardar cambios"
                : "Crear autor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}