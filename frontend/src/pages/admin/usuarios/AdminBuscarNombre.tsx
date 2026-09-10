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

  const { data, isLoading, isError, error } = useListarUsuarios({
    skip: 0,
    limit: 1000,
  });

  const q = query.trim().toLowerCase();

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

  const totalFiltered = filtered.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

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
            <p className="font-medium text-[#18181B]">
              {u.nombre} {u.apellido || ""}
            </p>
            <p className="text-xs text-[#52525B]">@{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Correo",
      render: (u) => <span className="text-[#52525B] text-sm">{u.correo}</span>,
    },
    {
      header: "Teléfono",
      render: (u) => <span className="text-[#52525B] text-sm">{u.telefono || "—"}</span>,
    },
    {
      header: "Rol",
      render: (u) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#F4F4F5] text-[#52525B] capitalize">
          {u.rol}
        </span>
      ),
    },
    {
      header: "Saldo",
      render: (u) => (
        <span className="font-medium text-emerald-600 text-sm">
          ${u.saldo?.toLocaleString() || "0"}
        </span>
      ),
    },
    { header: "Estado", render: (u) => <StatusBadge active={u.activo} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#18181B] mb-1">Buscar personas</h1>
        <p className="text-[#52525B] text-sm">
          Busca por nombre, apellido, username, correo o teléfono. Todo en un solo campo.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A]" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Escribe para buscar... (ej: Oscar, Pineda, oscarpineda123)"
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563EB] transition-all"
        />
        {hasQuery && (
          <button
            onClick={() => handleQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A19A] hover:text-[#18181B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorAlert error={error} fallback="Error al cargar usuarios" />}

      {!isLoading && !isError && hasQuery && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#52525B]">
              {totalFiltered} {totalFiltered === 1 ? "resultado" : "resultados"} para "
              <span className="text-[#18181B]">{query.trim()}</span>"
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
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#E4E4E1] rounded-2xl bg-white">
              <Users className="w-10 h-10 text-[#A1A19A] mb-3" />
              <p className="text-[#52525B] text-sm">
                No se encontraron usuarios con "<span className="text-[#18181B]">{query.trim()}</span>"
              </p>
              <p className="text-[#A1A19A] text-xs mt-1">
                Intenta con otro nombre, apellido, username o correo.
              </p>
            </div>
          )}
        </>
      )}

      {!isLoading && !isError && !hasQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#E4E4E1] rounded-2xl bg-white">
          <Search className="w-10 h-10 text-[#A1A19A] mb-3" />
          <p className="text-[#52525B] text-sm">Empieza a escribir para buscar usuarios</p>
          <p className="text-[#A1A19A] text-xs mt-1">
            Funciona con nombre, apellido, username, correo o teléfono.
          </p>
        </div>
      )}

      {selectedUser && (
        <UsuarioDetalleModal usuario={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}