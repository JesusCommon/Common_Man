import { useState, useMemo } from "react";
import { useListarUsuarios, useActivarUsuario, useDesactivarUsuario } from "@/hooks";
import { Search, Users, UserCheck, UserX, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { UsuarioDetalleModal } from "@/components/usuarios/UsuarioDetalleModal";
import type { UsuarioAdminResponse } from "@/api/types";

type Tab = "todos" | "activos" | "inactivos";
const PAGE_SIZE = 20;

interface Filtros {
  username: string;
  id: string;
  correo: string;
}
const filtrosVacios: Filtros = { username: "", id: "", correo: "" };

export default function Admin() {
  const [tab, setTab] = useState<Tab>("todos");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UsuarioAdminResponse | null>(null);

  const [inputs, setInputs] = useState<Filtros>(filtrosVacios);
  const [aplicados, setAplicados] = useState<Filtros>(filtrosVacios);

  // ✅ Carga todos los usuarios (el backend limita con MAX_LIMIT)
  const { data, isLoading, isError } = useListarUsuarios({ skip: 0, limit: 1000 });

  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();

  const dataset = useMemo(() => data?.items ?? [], [data?.items]);

  // StatCards globales (siempre del dataset completo)
  const totalGlobal = dataset.length;
  const activosGlobal = dataset.filter((u) => u.activo).length;
  const inactivosGlobal = totalGlobal - activosGlobal;

  // Tabs client-side
  const porTab = useMemo(() => {
    if (tab === "activos") return dataset.filter((u) => u.activo);
    if (tab === "inactivos") return dataset.filter((u) => !u.activo);
    return dataset;
  }, [dataset, tab]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: totalGlobal },
    { key: "activos", label: "Activos", count: activosGlobal },
    { key: "inactivos", label: "Inactivos", count: inactivosGlobal },
  ];

  // Filtros de búsqueda sobre el tab seleccionado
  const filtered = useMemo(() => {
    const u = aplicados.username.trim().toLowerCase();
    const id = aplicados.id.trim().toLowerCase();
    const c = aplicados.correo.trim().toLowerCase();
    if (!u && !id && !c) return porTab;
    return porTab.filter((user) => {
      const mU = !u || (user.username ?? "").toLowerCase().includes(u);
      const mId =
        !id ||
        (user.id ?? "").toLowerCase() === id ||
        (user.identificador ?? "").toLowerCase() === id;
      const mC = !c || (user.correo ?? "").toLowerCase().includes(c);
      return mU && mId && mC;
    });
  }, [porTab, aplicados]);

  const totalFiltered = filtered.length;
  const totalPaginas = Math.ceil(totalFiltered / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const setInput = (key: keyof Filtros, value: string) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const aplicarFiltros = () => {
    setAplicados({ ...inputs });
    setPage(1);
  };

  const limpiarFiltros = () => {
    setInputs(filtrosVacios);
    setAplicados(filtrosVacios);
    setPage(1);
  };

  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") aplicarFiltros();
  };

  const inputCls =
    "w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none";

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E4E4E1] border-t-[#2563EB]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">Error al cargar los usuarios.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#18181B]">Usuarios</h1>
        <p className="text-sm text-[#52525B]">Gestión de cuentas registradas en la plataforma.</p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{totalGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Total</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{activosGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Activos</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <UserX className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{inactivosGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Inactivos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F4F4F5] rounded-full p-1 w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              tab === key ? "bg-white text-[#18181B] shadow-sm" : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            {label} <span className="text-xs text-[#A1A19A]">({count})</span>
          </button>
        ))}
      </div>

      {/* Filtros de búsqueda */}
      <div className="rounded-xl border border-[#E4E4E1] bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A]" />
            <input
              type="text"
              value={inputs.username}
              onChange={(e) => setInput("username", e.target.value)}
              onKeyDown={onEnter}
              placeholder="@username..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <input
            type="text"
            value={inputs.id}
            onChange={(e) => setInput("id", e.target.value)}
            onKeyDown={onEnter}
            placeholder="ID (MongoDB o UUID)..."
            className={`${inputCls} font-mono`}
          />
          <input
            type="text"
            value={inputs.correo}
            onChange={(e) => setInput("correo", e.target.value)}
            onKeyDown={onEnter}
            placeholder="correo@..."
            className={inputCls}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#A1A19A]">
            Presiona <span className="font-mono text-[#52525B]">Enter</span> para buscar
          </p>
          <div className="flex items-center gap-2">
            <button onClick={limpiarFiltros} className="flex items-center gap-1.5 text-sm text-[#52525B] hover:text-[#18181B] transition">
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
            <button onClick={aplicarFiltros} className="rounded-lg bg-[#2563EB] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1D4ED8] transition">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {paginated.length === 0 ? (
        <div className="rounded-lg border border-[#E4E4E1] bg-white p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-[#E4E4E1]" />
          <h3 className="text-lg font-medium text-[#18181B]">Sin resultados</h3>
          <p className="mt-1 text-sm text-[#52525B]">No se encontraron usuarios en esta categoría.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E4E4E1] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-xs font-semibold uppercase tracking-wider text-[#A1A19A]">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {paginated.map((u) => (
                <tr key={u.id} onClick={() => setSelectedUser(u)} className="cursor-pointer transition hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#18181B] truncate">{u.nombre} {u.apellido || ""}</p>
                        <p className="text-xs text-[#A1A19A]">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525B]">{u.correo}</td>
                  <td className="px-4 py-3 text-[#52525B]">{u.telefono || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.rol === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E1]"}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3"><span className="font-medium text-emerald-600">${u.saldo?.toLocaleString() || "0"}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${u.activo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      {u.activo ? (
                        <button onClick={() => desactivar.mutate(u.id)} disabled={desactivar.isPending} title="Desactivar" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50">
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => activar.mutate(u.id)} disabled={activar.isPending} title="Activar" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50">
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

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50">
            Anterior
          </button>
          <span className="text-sm text-[#52525B]">Página {page} de {totalPaginas} ({totalFiltered} usuarios)</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPaginas} className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50">
            Siguiente
          </button>
        </div>
      )}

      {selectedUser && <UsuarioDetalleModal usuario={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}