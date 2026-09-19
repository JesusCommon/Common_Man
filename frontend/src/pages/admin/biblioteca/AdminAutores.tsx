import { useState } from "react";
import {
  useListarAutores,
  useActivarAutor,
  useDesactivarAutor,
  type FiltroListadoAutores,
} from "@/hooks";
import { ActivoBadge } from "@/components/biblioteca/ActivarBadge";
import { AutorFormModal } from "@/components/biblioteca/AutorFormModal";
import { Pencil, UserPlus, Users } from "lucide-react";
import type { AutorResponse } from "@/api/types";

const FILTROS: { value: FiltroListadoAutores; label: string }[] = [
  { value: "all", label: "📋 Todos" },
  { value: "activos", label: "🟢 Activos" },
  { value: "inactivos", label: "🔴 Inactivos" },
];

export default function AdminAutores() {
  const [filtro, setFiltro] = useState<FiltroListadoAutores>("all");
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorEditando, setAutorEditando] = useState<AutorResponse | null>(null);

  const { data, isLoading, isError } = useListarAutores(filtro, { skip, limit });
  const activar = useActivarAutor();
  const desactivar = useDesactivarAutor();

  const autores = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = Math.ceil(total / limit);
  const paginaActual = Math.floor(skip / limit) + 1;

  function cambiarFiltro(nuevo: FiltroListadoAutores) {
    setFiltro(nuevo);
    setSkip(0);
  }

  function abrirNuevo() {
    setAutorEditando(null);
    setModalAbierto(true);
  }

  function abrirEdicion(autor: AutorResponse) {
    setAutorEditando(autor);
    setModalAbierto(true);
  }

  function toggleEstado(autor: AutorResponse) {
    const nombre = `${autor.nombre} ${autor.apellido}`;
    const mensaje = autor.activo
      ? `¿Desactivar a "${nombre}"? Sus libros no se eliminan.`
      : `¿Activar nuevamente a "${nombre}"?`;
    if (!window.confirm(mensaje)) return;

    if (autor.activo) desactivar.mutate(autor.id);
    else activar.mutate(autor.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Autores</h1>
          <p className="text-sm text-gray-500">Gestiona el catálogo de autores</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo autor
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTROS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => cambiarFiltro(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filtro === value
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Listado */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">Error al cargar los autores.</p>
        </div>
      ) : autores.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">No hay autores</h3>
          <p className="mt-1 text-sm text-gray-500">
            Crea el primero para empezar a catalogar libros.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">País</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {autores.map((autor) => (
                  <tr key={autor.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {autor.nombre} {autor.apellido}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {autor.pais_nacimiento ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ActivoBadge activo={autor.activo} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEdicion(autor)}
                          title="Editar"
                          className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleEstado(autor)}
                          disabled={activar.isPending || desactivar.isPending}
                          className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                            autor.activo
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {autor.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">
                Página {paginaActual} de {totalPaginas} ({total} autores)
              </span>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={paginaActual >= totalPaginas}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal crear/editar */}
      <AutorFormModal
        abierto={modalAbierto}
        autor={autorEditando}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}