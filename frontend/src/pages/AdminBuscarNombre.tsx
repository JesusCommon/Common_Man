import { useState, useMemo } from "react";
import { useListarUsuarios } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UsuarioDetalleModal } from "@/components/usuarios/UsuarioDetalleModal";
import { Search, X, Users } from "lucide-react";
import type { UsuarioAdminResponse } from "@/api/types";

const PAGE_SIZE = 20;

export default function AdminBuscarPorNombre() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UsuarioAdminResponse | null>(null);

  // Traemos un lote grande para filtrar localmente sin select de campo
  const { data, isLoading, isError, error } = useListarUsuarios({
    skip: 0,
    limit: 1000,
  });

  const q = query.trim().toLowerCase();

  // Omnisearch: busca en nombre, apellido, username, correo, teléfono
  const filtered = useMemo(() => {
    if (!q) return [];
    return (data?.items ?? []).filter((u) => {
      const haystack = [
        u.nombre,
        u.apellido,
        u.username,
        u.correo,
        u.telefono,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data?.items, q]);

  // Paginación local sobre resultados filtrados
  const totalFiltered = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Resetear página cuando cambia la búsqueda
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const hasQuery = query.trim().length > 0;

  const columns: Column<UsuarioAdminResponse>[] = [
    {
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.nombre} />
          <div>
            <p className="font-medium text-white">
              {u.nombre} {u.apellido || ""}
            </p>
            <p className="text-xs text-slate-500">@{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Correo",
      render: (u) => <span className="text-slate-400 text-sm">{u.correo}</span>,
    },
    {
      header: "Teléfono",
      render: (u) => <span className="text-slate-400 text-sm">{u.telefono || "—"}</span>,
    },
    {
      header: "Rol",
      render: (u) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 capitalize">
          {u.rol}
        </span>
      ),
    },
    {
      header: "Saldo",
      render: (u) => (
        <span className="font-medium text-emerald-400 text-sm">
          ${u.saldo?.toLocaleString() || "0"}
        </span>
      ),
    },
    { header: "Estado", render: (u) => <StatusBadge active={u.activo} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Buscar personas</h1>
        <p className="text-slate-500 text-sm">
          Busca por nombre, apellido, username, correo o teléfono. Todo en un solo campo.
        </p>
      </div>

      {/* Barra de búsqueda omnisearch */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Escribe para buscar... (ej: Oscar, Pineda, oscarpineda123)"
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
        />
        {hasQuery && (
          <button
            onClick={() => handleQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Estados de carga / error */}
      {isLoading && <Spinner />}
      {isError && <ErrorAlert error={error} fallback="Error al cargar usuarios" />}

      {/* Resultados */}
      {!isLoading && !isError && hasQuery && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {totalFiltered} {totalFiltered === 1 ? "resultado" : "resultados"} para "
              <span className="text-slate-300">{query.trim()}</span>"
            </p>
          </div>

          {totalFiltered > 0 ? (
            <>
              <DataTable
                columns={columns}
                data={paginated}
                getRowKey={(u) => u.id || u.identificador || u.username}
                onRowClick={setSelectedUser}
                emptyMessage="No se encontraron usuarios."
              />
              <Pagination
                page={page}
                total={totalFiltered}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <Users className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">
                No se encontraron usuarios con "<span className="text-slate-300">{query.trim()}</span>"
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Intenta con otro nombre, apellido, username o correo.
              </p>
            </div>
          )}
        </>
      )}

      {/* Estado inicial vacío */}
      {!isLoading && !isError && !hasQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Search className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">Empieza a escribir para buscar usuarios</p>
          <p className="text-slate-600 text-xs mt-1">
            Funciona con nombre, apellido, username, correo o teléfono.
          </p>
        </div>
      )}

      {/* Modal de detalle al hacer click (igual que Admin.tsx) */}
      {selectedUser && (
        <UsuarioDetalleModal usuario={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}