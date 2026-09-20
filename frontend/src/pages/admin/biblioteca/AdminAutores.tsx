import { useState } from "react";
import {
  useListarAutores,
  useActivarAutor,
  useDesactivarAutor,
} from "@/hooks";
import { ActivoBadge } from "@/components/biblioteca/ActivarBadge";
import { AutorFormModal } from "@/components/biblioteca/AutorFormModal";
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  Pencil,
  UserPlus,
} from "lucide-react";
import type { AutorResponse } from "@/api/types";

type Tab = "all" | "activos" | "inactivos";
const PAGE_SIZE = 20;

export default function AdminAutores() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorEditando, setAutorEditando] = useState<AutorResponse | null>(null);
  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarAutores("all", params);
  const activos = useListarAutores("activos", params);
  const inactivos = useListarAutores("inactivos", params);
  const activar = useActivarAutor();
  const desactivar = useDesactivarAutor();

  const current = tab === "all" ? todos : tab === "activos" ? activos : inactivos;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: todos.data?.total ?? 0 },
    { key: "activos", label: "Activos", count: activos.data?.total ?? 0 },
    { key: "inactivos", label: "Inactivos", count: inactivos.data?.total ?? 0 },
  ];

  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };

  const abrirNuevo = () => {
    setAutorEditando(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (autor: AutorResponse) => {
    setAutorEditando(autor);
    setModalAbierto(true);
  };

  const autores = current.data?.items ?? [];
  const total = current.data?.total ?? 0;
  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  if (current.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E4E4E1] border-t-[#2563EB]" />
      </div>
    );
  }

  if (current.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">Error al cargar los autores.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B]">Autores</h1>
          <p className="text-sm text-[#52525B]">
            Gestión de autores del catálogo de libros.
          </p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo autor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{todos.data?.total ?? 0}</p>
            <p className="text-xs text-[#A1A19A]">Total</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{activos.data?.total ?? 0}</p>
            <p className="text-xs text-[#A1A19A]">Activos</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <UserX className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{inactivos.data?.total ?? 0}</p>
            <p className="text-xs text-[#A1A19A]">Inactivos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-[#F4F4F5] rounded-full p-1 w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              tab === key
                ? "bg-white text-[#18181B] shadow-sm"
                : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            {label} <span className="text-xs text-[#A1A19A]">({count})</span>
          </button>
        ))}
      </div>

      {autores.length === 0 ? (
        <div className="rounded-lg border border-[#E4E4E1] bg-white p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-[#E4E4E1]" />
          <h3 className="text-lg font-medium text-[#18181B]">No hay autores</h3>
          <p className="mt-1 text-sm text-[#52525B]">
            No hay autores en esta categoría.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E4E4E1] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-xs font-semibold uppercase tracking-wider text-[#A1A19A]">
              <tr>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {autores.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => abrirEdicion(a)}
                  className="cursor-pointer transition hover:bg-[#FAFAF8]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EFF4FE] border border-[#BFDBFE] flex items-center justify-center text-sm font-bold text-[#2563EB] shrink-0">
                        {a.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#18181B]">
                          {a.nombre} {a.apellido || ""}
                        </p>
                        <p className="text-xs text-[#A1A19A]">
                          {a.pais_nacimiento || "Sin país"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ActivoBadge activo={a.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => abrirEdicion(a)}
                        title="Editar"
                        className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#2563EB] transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {a.activo ? (
                        <button
                          onClick={() => desactivar.mutate(a.id)}
                          disabled={desactivar.isPending}
                          title="Desactivar"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activar.mutate(a.id)}
                          disabled={activar.isPending}
                          title="Activar"
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-[#52525B]">
            Página {page} de {totalPaginas} ({total} autores)
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPaginas}
            className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      <AutorFormModal
        abierto={modalAbierto}
        autor={autorEditando}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}