import { useEffect, useRef, useState } from "react";
import { useCrearAutor, useActualizarAutor } from "@/hooks";
import { X } from "lucide-react";
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
  const [nombre, setNombre] = useState(autor?.nombre ?? "");
  const [apellido, setApellido] = useState(autor?.apellido ?? "");
  const [pais, setPais] = useState(autor?.pais_nacimiento ?? "");
  const [imagen, setImagen] = useState(autor?.imagen ?? "");

  const prevAutorId = useRef(autor?.id);
  useEffect(() => {
    if (autor?.id !== prevAutorId.current) {
      setNombre(autor?.nombre ?? "");
      setApellido(autor?.apellido ?? "");
      setPais(autor?.pais_nacimiento ?? "");
      setImagen(autor?.imagen ?? "");
      prevAutorId.current = autor?.id;
    }
  }, [autor]);

  const isPending = crear.isPending || actualizar.isPending;
  const error = crear.error || actualizar.error;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nombre,
      apellido,
      pais_nacimiento: pais.trim() ? pais.trim() : undefined,
      imagen: imagen.trim() || undefined,
    };

    if (autor) {
      actualizar.mutate({ id: autor.id, data: payload }, { onSuccess: onClose });
    } else {
      crear.mutate(payload, { onSuccess: onClose });
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
          
          <div>
            <label className="mb-1 block text-sm font-medium text-[#52525B]">
              Imagen del autor{" "}
              <span className="font-normal text-[#A1A19A]">(opcional, URL)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E4E4E1] bg-[#F4F4F5] flex items-center justify-center shrink-0">
                {imagen.trim() ? (
                  <img src={imagen.trim()} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[#2563EB]">
                    {(nombre || "A").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <input
                type="url"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://…/autor.jpg"
                className="w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <p className="mt-1 text-xs text-[#A1A19A]">
              Se muestra como avatar en la sección "Voces destacadas" de la biblioteca.
            </p>
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !nombre.trim() || !apellido.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isPending ? "Guardando..." : autor ? "Guardar cambios" : "Crear autor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}