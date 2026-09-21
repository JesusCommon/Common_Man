import { useState } from "react";
import {
  useListarLibrosAdmin,
  useActivarLibro,
  useDesactivarLibro,
  useAutoresPublicos,
  useEditorialesPublicas,
  useGenerosPublicos,
} from "@/hooks";
import { ActivoBadge } from "@/components/biblioteca/ActivarBadge";
import { LibroFormModal } from "@/components/biblioteca/LibroFormModal";
import {
  BookMarked,
  CheckCircle2,
  XCircle,
  Pencil,
  Plus,
  Search,
  Book,
} from "lucide-react";
import type { Idiomas, LibroAdminResponse } from "@/api/types";

const PAGE_SIZE = 20;

const formatPrecio = (precio: string | number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(precio));

export default function AdminLibros() {
  const [page, setPage] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [libroEditando, setLibroEditando] = useState<LibroAdminResponse | null>(null);

  // Filtros
  const [nombreInput, setNombreInput] = useState("");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [autorFiltro, setAutorFiltro] = useState("");
  const [editorialFiltro, setEditorialFiltro] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [idiomaFiltro, setIdiomaFiltro] = useState("");
  const [soloActivos, setSoloActivos] = useState(false);

  // Handlers que resetean página
  const handleNombreInput = (value: string) => {
    setNombreInput(value);
    setPage(1);
  };

  const handleNombreFiltro = () => {
    setNombreFiltro(nombreInput);
  };

  const handleAutorFiltro = (value: string) => {
    setAutorFiltro(value);
    setPage(1);
  };

  const handleEditorialFiltro = (value: string) => {
    setEditorialFiltro(value);
    setPage(1);
  };

  const handleGeneroFiltro = (value: string) => {
    setGeneroFiltro(value);
    setPage(1);
  };

  const handleIdiomaFiltro = (value: string) => {
    setIdiomaFiltro(value);
    setPage(1);
  };

  const handleSoloActivos = (checked: boolean) => {
    setSoloActivos(checked);
    setPage(1);
  };

  // Listas públicas para selects y para mostrar nombres
  const { data: autores } = useAutoresPublicos();
  const { data: editoriales } = useEditorialesPublicas();
  const { data: generos } = useGenerosPublicos();

  // Contadores globales
  const countTodos = useListarLibrosAdmin({ limit: 1 });
  const countActivos = useListarLibrosAdmin({ limit: 1, solo_activos: true });
  const totalGlobal = countTodos.data?.total ?? 0;
  const activosGlobal = countActivos.data?.total ?? 0;
  const inactivosGlobal = Math.max(0, totalGlobal - activosGlobal);

  // Listado principal con filtros
  const { data, isLoading, isError } = useListarLibrosAdmin({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    nombre: nombreFiltro || undefined,
    autor_id: autorFiltro || undefined,
    editorial_id: editorialFiltro || undefined,
    genero_id: generoFiltro || undefined,
    idioma: (idiomaFiltro || undefined) as Idiomas | undefined,
    solo_activos: soloActivos ? true : undefined,
  });

  const activar = useActivarLibro();
  const desactivar = useDesactivarLibro();

  const libros = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  const autorNombre = (id: string) =>
    autores?.find((a) => a.id === id)?.nombre ?? "—";
  const generoNombre = (id: string) =>
    generos?.find((g) => g.id === id)?.nombre ?? "—";

  const abrirNuevo = () => {
    setLibroEditando(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (libro: LibroAdminResponse) => {
    setLibroEditando(libro);
    setModalAbierto(true);
  };

  const limpiarFiltros = () => {
    setNombreInput("");
    setNombreFiltro("");
    setAutorFiltro("");
    setEditorialFiltro("");
    setGeneroFiltro("");
    setIdiomaFiltro("");
    setSoloActivos(false);
    setPage(1);
  };

  const selectCls =
    "rounded-lg border border-[#E4E4E1] bg-white px-3 py-2 text-sm text-[#52525B] focus:border-[#2563EB] focus:outline-none";

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
        <p className="text-sm text-red-600">Error al cargar los libros.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B]">Libros</h1>
          <p className="text-sm text-[#52525B]">Catálogo completo de la biblioteca.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo libro
        </button>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{totalGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Total</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{activosGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Activos</p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#18181B]">{inactivosGlobal}</p>
            <p className="text-xs text-[#A1A19A]">Inactivos</p>
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="rounded-xl border border-[#E4E4E1] bg-white p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-45">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A]" />
          <input
            type="text"
            value={nombreInput}
            onChange={(e) => handleNombreInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNombreFiltro()}
            placeholder="Buscar por título... (Enter)"
            className="w-full rounded-lg border border-[#E4E4E1] pl-9 pr-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
        <select value={autorFiltro} onChange={(e) => handleAutorFiltro(e.target.value)} className={selectCls}>
          <option value="">Todos los autores</option>
          {autores?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>
        <select value={editorialFiltro} onChange={(e) => handleEditorialFiltro(e.target.value)} className={selectCls}>
          <option value="">Todas las editoriales</option>
          {editoriales?.map((ed) => (
            <option key={ed.id} value={ed.id}>
              {ed.nombre}
            </option>
          ))}
        </select>
        <select value={generoFiltro} onChange={(e) => handleGeneroFiltro(e.target.value)} className={selectCls}>
          <option value="">Todos los géneros</option>
          {generos?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <select value={idiomaFiltro} onChange={(e) => handleIdiomaFiltro(e.target.value)} className={selectCls}>
          <option value="">Todos los idiomas</option>
          <option value="Español">Español</option>
          <option value="Ingles">Inglés</option>
          <option value="Portugues">Portugués</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-[#52525B]">
          <input
            type="checkbox"
            checked={soloActivos}
            onChange={(e) => handleSoloActivos(e.target.checked)}
            className="w-4 h-4 accent-[#2563EB]"
          />
          Solo activos
        </label>
        <button
          onClick={limpiarFiltros}
          className="text-sm text-[#2563EB] hover:underline"
        >
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      {libros.length === 0 ? (
        <div className="rounded-lg border border-[#E4E4E1] bg-white p-12 text-center">
          <Book className="mx-auto mb-3 h-10 w-10 text-[#E4E4E1]" />
          <h3 className="text-lg font-medium text-[#18181B]">No hay libros</h3>
          <p className="mt-1 text-sm text-[#52525B]">
            Ajusta los filtros o crea un nuevo libro.
          </p>
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
                <tr
                  key={l.id}
                  onClick={() => abrirEdicion(l)}
                  className="cursor-pointer transition hover:bg-[#FAFAF8]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {l.portada ? (
                        <img
                          src={l.portada}
                          alt={l.nombre}
                          className="w-8 h-11 rounded object-cover border border-[#E4E4E1] shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-11 rounded bg-[#F4F4F5] border border-[#E4E4E1] flex items-center justify-center shrink-0">
                          <Book className="w-4 h-4 text-[#A1A19A]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[#18181B] truncate max-w-50">
                          {l.nombre}
                        </p>
                        <p className="text-xs text-[#A1A19A]">
                          {l.edicion ? `${l.edicion} · ` : ""}
                          {l.anio_publicacion}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525B]">{autorNombre(l.autor_id)}</td>
                  <td className="px-4 py-3 text-[#52525B]">{generoNombre(l.genero_id)}</td>
                  <td className="px-4 py-3 font-medium text-[#18181B]">
                    {formatPrecio(l.precio)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        l.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {l.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActivoBadge activo={l.activo} />
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => abrirEdicion(l)}
                        title="Editar"
                        className="p-1.5 rounded-lg hover:bg-[#F4F4F5] text-[#2563EB] transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {l.activo ? (
                        <button
                          onClick={() => desactivar.mutate(l.id)}
                          disabled={desactivar.isPending}
                          title="Desactivar"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => activar.mutate(l.id)}
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

      {/* Paginación */}
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
            Página {page} de {totalPaginas} ({total} libros)
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

      <LibroFormModal
        abierto={modalAbierto}
        libro={libroEditando}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}