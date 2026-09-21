import { useState } from "react";
import {
  useListarGeneros,
  useActivarGenero,
  useDesactivarGenero,
} from "@/hooks";
import { GeneroFormModal } from "@/components/biblioteca/GeneroFormModal";
import { ActivoBadge } from "@/components/biblioteca/ActivarBadge";
import {
  Tags,
  CheckCircle2,
  XCircle,
  Pencil,
  Plus,
} from "lucide-react";
import type { GeneroResponse } from "@/api/types";

type Tab = "all" | "activos" | "inactivos";
const PAGE_SIZE = 20;

export default function AdminGeneros() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [generoEditando, setGeneroEditando] = useState<GeneroResponse | null>(null);
  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarGeneros("all", params);
  const activos = useListarGeneros("activos", params);
  const inactivos = useListarGeneros("inactivos", params);
  const activar = useActivarGenero();
  const desactivar = useDesactivarGenero();

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
    setGeneroEditando(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (genero: GeneroResponse) => {
    setGeneroEditando(genero);
    setModalAbierto(true);
  };

  const generos = current.data?.items ?? [];
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
        <p className="text-sm text-red-600">Error al cargar los géneros.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B]">Géneros</h1>
          <p className="text-sm text-[#52525B]">
            Gestión de géneros literarios del catálogo.
          </p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo género
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
            <Tags className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{todos.data?.total ?? 0}</p>
            <p className="text-xs text-[#A1A19A]">Total</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{activos.data?.total ?? 0}</p>
            <p className="text-xs text-[#A1A19A]">Activos</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
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

      {generos.length === 0 ? (
        <div className="rounded-lg border border-[#E4E4E1] bg-white p-12 text-center">
          <Tags className="mx-auto mb-3 h-10 w-10 text-[#E4E4E1]" />
          <h3 className="text-lg font-medium text-[#18181B]">No hay géneros</h3>
          <p className="mt-1 text-sm text-[#52525B]">No hay géneros en esta categoría.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E4E4E1] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-xs font-semibold uppercase tracking-wider text-[#A1A19A]">
              <tr>
                <th className="px-4 py-3">Género</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {generos.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => abrirEdicion(g)}
                  className="cursor-pointer transition hover:bg-[#FAFAF8]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFF4FE] border border-[#BFDBFE] flex items-center justify-center text-sm font-bold text-[#2563EB] shrink-0">
                        {g.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#18181B] truncate">{g.nombre}</p>
                        <p className="text-xs text-[#A1A19A] truncate max-w-xs">
                          {g.descripcion || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ActivoBadge activo={g.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => abrirEdicion(g)}
                        title="Editar"
                        className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#2563EB] transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {g.activo ? (
                        <button
                          onClick={() => desactivar.mutate(g.id)}
                          disabled={desactivar.isPending}
                          title="Desactivar"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activar.mutate(g.id)}
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
            Página {page} de {totalPaginas} ({total} géneros)
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

      <GeneroFormModal
        abierto={modalAbierto}
        genero={generoEditando}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}