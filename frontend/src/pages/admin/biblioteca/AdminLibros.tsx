import { useState } from "react";
import {
  useListarLibrosAdmin,
  useListarLibrosActivos,
  useListarLibrosInactivos,
  useActivarLibro,
  useDesactivarLibro,
  useAutoresPublicos,
  useEditorialesPublicas,
  useGenerosPublicos,
} from "@/hooks";
import { ActivoBadge } from "@/components/biblioteca/ActivarBadge";
import { LibroFormModal } from "@/components/biblioteca/LibroFormModal";
import { BookMarked, CheckCircle2, XCircle, Pencil, Plus, Search, Book, RotateCcw } from "lucide-react";
import type { Idiomas, LibroAdminResponse } from "@/api/types";

type Tab = "all" | "activos" | "inactivos";
const PAGE_SIZE = 20;

const formatPrecio = (precio: string | number): string =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(Number(precio));

export default function AdminLibros() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [libroEditando, setLibroEditando] = useState<LibroAdminResponse | null>(null);
  const [nombreInput, setNombreInput] = useState("");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [autorFiltro, setAutorFiltro] = useState("");
  const [editorialFiltro, setEditorialFiltro] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [idiomaFiltro, setIdiomaFiltro] = useState("");
  const { data: autores } = useAutoresPublicos();
  const { data: editoriales } = useEditorialesPublicas();
  const { data: generos } = useGenerosPublicos();

  const baseFiltros = {
    nombre: nombreFiltro || undefined,
    autor_id: autorFiltro || undefined,
    editorial_id: editorialFiltro || undefined,
    genero_id: generoFiltro || undefined,
    idioma: (idiomaFiltro || undefined) as Idiomas | undefined,
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  };

  const todos = useListarLibrosAdmin({ ...baseFiltros });
  const activos = useListarLibrosActivos({ ...baseFiltros });
  const inactivos = useListarLibrosInactivos({ ...baseFiltros });

  const current = tab === "all" ? todos : tab === "activos" ? activos : inactivos;
  const activar = useActivarLibro();
  const desactivar = useDesactivarLibro();

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: todos.data?.total ?? 0 },
    { key: "activos", label: "Activos", count: activos.data?.total ?? 0 },
    { key: "inactivos", label: "Inactivos", count: inactivos.data?.total ?? 0 },
  ];

  const libros = current.data?.items ?? [];
  const total = current.data?.total ?? 0;
  const totalPaginas = Math.ceil(total / PAGE_SIZE);
  const autorNombre = (id: string) => autores?.find((a) => a.id === id)?.nombre ?? "—";
  const generoNombre = (id: string) => generos?.find((g) => g.id === id)?.nombre ?? "—";

  const aplicarNombre = () => {
    setNombreFiltro(nombreInput);
    setPage(1);
  };
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") aplicarNombre();
  };
  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };
  const setFiltroYReset = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };
  const limpiarFiltros = () => {
    setNombreInput("");
    setNombreFiltro("");
    setAutorFiltro("");
    setEditorialFiltro("");
    setGeneroFiltro("");
    setIdiomaFiltro("");
    setPage(1);
  };

  const abrirNuevo = () => {
    setLibroEditando(null);
    setModalAbierto(true);
  };
  const abrirEdicion = (libro: LibroAdminResponse) => {
    setLibroEditando(libro);
    setModalAbierto(true);
  };

  const selectCls = "rounded-lg border border-[#E4E4E1] bg-white px-3 py-2 text-sm text-[#52525B] focus:border-[#2563EB] focus:outline-none";

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
        <p className="text-sm text-red-600">Error al cargar los libros.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B]">Libros</h1>
          <p className="text-sm text-[#52525B]">Catálogo completo de la biblioteca.</p>
        </div>
        <button onClick={abrirNuevo} className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition">
          <Plus className="w-4 h-4" /> Nuevo libro
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{tabs[0].count}</p>
            <p className="text-xs text-[#A1A19A]">Total</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{tabs[1].count}</p>
            <p className="text-xs text-[#A1A19A]">Activos</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{tabs[2].count}</p>
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
              tab === key ? "bg-white text-[#18181B] shadow-sm" : "text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            {label} <span className="text-xs text-[#A1A19A]">({count})</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-45">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A]" />
          <input
            type="text"
            value={nombreInput}
            onChange={(e) => setNombreInput(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Buscar por título... (Enter)"
            className="w-full rounded-lg border border-[#E4E4E1] pl-9 pr-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
        <select value={autorFiltro} onChange={(e) => setFiltroYReset(setAutorFiltro)(e.target.value)} className={selectCls}>
          <option value="">Todos los autores</option>
          {autores?.map((a) => (<option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>))}
        </select>
        <select value={editorialFiltro} onChange={(e) => setFiltroYReset(setEditorialFiltro)(e.target.value)} className={selectCls}>
          <option value="">Todas las editoriales</option>
          {editoriales?.map((ed) => (<option key={ed.id} value={ed.id}>{ed.nombre}</option>))}
        </select>
        <select value={generoFiltro} onChange={(e) => setFiltroYReset(setGeneroFiltro)(e.target.value)} className={selectCls}>
          <option value="">Todos los géneros</option>
          {generos?.map((g) => (<option key={g.id} value={g.id}>{g.nombre}</option>))}
        </select>
        <select value={idiomaFiltro} onChange={(e) => setFiltroYReset(setIdiomaFiltro)(e.target.value)} className={selectCls}>
          <option value="">Todos los idiomas</option>
          <option value="Español">Español</option>
          <option value="Ingles">Inglés</option>
          <option value="Portugues">Portugués</option>
        </select>
        <button onClick={limpiarFiltros} className="flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline">
          <RotateCcw className="w-3.5 h-3.5" /> Limpiar
        </button>
      </div>

      {libros.length === 0 ? (
        <div className="rounded-lg border border-[#E4E4E1] bg-white p-12 text-center">
          <Book className="mx-auto mb-3 h-10 w-10 text-[#E4E4E1]" />
          <h3 className="text-lg font-medium text-[#18181B]">No hay libros</h3>
          <p className="mt-1 text-sm text-[#52525B]">Ajusta los filtros o crea un nuevo libro.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E4E4E1] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-xs font-semibold uppercase tracking-wider text-[#A1A19A]">
              <tr>
                <th className="px-4 py-3">Libro</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Género</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F5]">
              {libros.map((l) => (
                <tr key={l.id} onClick={() => abrirEdicion(l)} className="cursor-pointer transition hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {l.portada ? (
                        <img src={l.portada} alt={l.nombre} className="w-8 h-11 rounded object-cover border border-[#E4E4E1] shrink-0" />
                      ) : (
                        <div className="w-8 h-11 rounded bg-[#F4F4F5] border border-[#E4E4E1] flex items-center justify-center shrink-0">
                          <Book className="w-4 h-4 text-[#A1A19A]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[#18181B] truncate max-w-50">{l.nombre}</p>
                        <p className="text-xs text-[#A1A19A]">{l.edicion ? `${l.edicion} · ` : ""}{l.anio_publicacion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525B]">{autorNombre(l.autor_id)}</td>
                  <td className="px-4 py-3 text-[#52525B]">{generoNombre(l.genero_id)}</td>
                  <td className="px-4 py-3 font-medium text-[#18181B]">{formatPrecio(l.precio)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{l.stock}</span>
                  </td>
                  <td className="px-4 py-3"><ActivoBadge activo={l.activo} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => abrirEdicion(l)} title="Editar" className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#2563EB] transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {l.activo ? (
                        <button onClick={() => desactivar.mutate(l.id)} disabled={desactivar.isPending} title="Desactivar" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50">
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => activar.mutate(l.id)} disabled={activar.isPending} title="Activar" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50">
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
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50">
            Anterior
          </button>
          <span className="text-sm text-[#52525B]">Página {page} de {totalPaginas} ({total} libros)</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPaginas} className="rounded-md border border-[#E4E4E1] bg-white px-3 py-1.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] disabled:opacity-50">
            Siguiente
          </button>
        </div>
      )}

      <LibroFormModal abierto={modalAbierto} libro={libroEditando} onClose={() => setModalAbierto(false)} />
    </div>
  );
}