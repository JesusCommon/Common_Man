import { useEffect, useMemo, useRef, useState } from "react";
import {
  useBuscarLibros,
  useAutoresPublicos,
  useGenerosPublicos,
  useEditorialesPublicas
} from "@/hooks";
import { AlphabetBar } from "@/components/biblioteca/AlfabetoBar";
import { BookCard } from "@/components/biblioteca/BookCard";
import { BookOpenModal } from "@/components/biblioteca/BookOpenModal";
import { AutoresDestacados } from "@/components/biblioteca/AutoresDestacados";
import { FiltrosBiblioteca } from "@/components/biblioteca/FiltrosBiblioteca";
import {
  filtrosBibliotecaVacios,
  type FiltrosBibliotecaValues,
} from "@/components/biblioteca/filtros.shared";
import { BookMarked, Search, X } from "lucide-react";
import type { Idiomas, LibroResponse } from "@/api/types";

const normalizarInicial = (titulo: string): string => {
  const limpio = titulo
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const ch = limpio.charAt(0).toUpperCase();
  return /^[A-Z]$/.test(ch) ? ch : "#";
};

export default function Biblioteca() {
  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState<FiltrosBibliotecaValues>(filtrosBibliotecaVacios);
  const [libroAbierto, setLibroAbierto] = useState<LibroResponse | null>(null);
  const [letraActiva, setLetraActiva] = useState("");
  const seccionesRef = useRef<Record<string, HTMLElement | null>>({});
  const resultadosRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setBusqueda(busquedaInput), 300);
    return () => clearTimeout(t);
  }, [busquedaInput]);

  const { data, isLoading } = useBuscarLibros({
    nombre: busqueda || undefined,
    autor_id: filtros.autor_id || undefined,
    editorial_id: filtros.editorial_id || undefined,
    genero_id: filtros.genero_id || undefined,
    idioma: (filtros.idioma || undefined) as Idiomas | undefined,
    limit: 100,
  });

  const { data: autores } = useAutoresPublicos();
  const { data: generos } = useGenerosPublicos();
  const { data: editoriales } = useEditorialesPublicas();
  const libros = useMemo(() => data?.items ?? [], [data?.items]);
  const totalResultados = data?.total ?? 0;
  const autorNombre = (id: string) => {
  const a = autores?.find((x) => x.id === id);
    return a ? `${a.nombre} ${a.apellido ?? ""}`.trim() : "Autor desconocido";
  };
  const generoNombre = (id: string) => generos?.find((g) => g.id === id)?.nombre ?? "";
  const editorialNombre = (id: string) => editoriales?.find((e) => e.id === id)?.nombre ?? "";

  const secciones = useMemo(() => {
    const map = new Map<string, LibroResponse[]>();
    const ordenados = [...libros].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    for (const libro of ordenados) {
      const letra = normalizarInicial(libro.nombre);
      if (!map.has(letra)) map.set(letra, []);
      map.get(letra)!.push(libro);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [libros]);

  const letrasDisponibles = useMemo(
    () => new Set(secciones.map(([l]) => l)),
    [secciones]
  );

  const hayFiltros =
    busquedaInput.trim() !== "" ||
    filtros.autor_id !== "" ||
    filtros.editorial_id !== "" ||
    filtros.genero_id !== "" ||
    filtros.idioma !== "";

  const aplicarFiltros = (patch: Partial<FiltrosBibliotecaValues>) => {
    setFiltros((prev) => ({ ...prev, ...patch }));
  };

  const limpiarTodo = () => {
    setFiltros(filtrosBibliotecaVacios);
    setBusquedaInput("");
    setBusqueda("");
    setLetraActiva("");
  };

  const seleccionarAutorDestacado = (id: string) => {
    setFiltros((prev) => ({ ...prev, autor_id: id }));
    if (id) {
      resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const saltarALetra = (letra: string) => {
    setLetraActiva(letra);
    if (letra === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    seccionesRef.current[letra]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#f3eee5] text-[#221e19] rounded-3xl p-6 sm:p-10 lg:p-14 space-y-10">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b23a2f] font-semibold">
          Biblioteca digital
        </p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]">
          Cada libro, una puerta que espera abrirse.
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8b8377]">
          Explora la colección ordenada alfabéticamente. Toca una portada para
          abrirla como un libro real y descubrir su historia.
        </p>

        <div className="relative mt-8 max-w-xl">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8377]" />
          <input
            type="text"
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            placeholder="Buscar por título…"
            className="w-full bg-transparent border-b border-[#d8cfbc] pl-8 pr-8 py-3 font-editorial text-lg placeholder:text-[#b5ac9d] focus:outline-none focus:border-[#b23a2f] transition-colors"
          />
          {busquedaInput && (
            <button
              onClick={() => setBusquedaInput("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8b8377] hover:text-[#221e19] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <AutoresDestacados
        activoId={filtros.autor_id}
        onSelect={seleccionarAutorDestacado}
      />

      <div ref={resultadosRef} className="space-y-6 scroll-mt-24">
        <FiltrosBiblioteca
          values={filtros}
          onChange={aplicarFiltros}
          onLimpiar={limpiarTodo}
          activo={hayFiltros}
          totalResultados={totalResultados}
        />

        <AlphabetBar
          disponibles={letrasDisponibles}
          activa={letraActiva}
          onJump={saltarALetra}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e4dccd] border-t-[#b23a2f]" />
        </div>
      ) : secciones.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <BookMarked className="w-12 h-12 text-[#e4dccd] mb-4" />
          <h3 className="font-editorial text-xl font-semibold">
            {hayFiltros ? "Sin coincidencias" : "La biblioteca está vacía"}
          </h3>
          <p className="mt-1 text-sm text-[#8b8377]">
            {hayFiltros
              ? "Prueba con otros filtros o limpia la búsqueda."
              : "Aún no hay libros publicados en el catálogo."}
          </p>
          {hayFiltros && (
            <button
              onClick={limpiarTodo}
              className="mt-4 rounded-full bg-[#221e19] px-5 py-2 text-sm font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-14">
          {secciones.map(([letra, items]) => (
            <section
              key={letra}
              ref={(el) => {
                seccionesRef.current[letra] = el;
              }}
              className="scroll-mt-36"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-editorial text-5xl font-semibold text-[#b23a2f]">
                  {letra}
                </span>
                <span className="flex-1 h-px bg-[#e4dccd]" />
                <span className="text-xs text-[#8b8377]">
                  {items.length} {items.length === 1 ? "libro" : "libros"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {items.map((libro) => (
                  <BookCard
                    key={libro.id}
                    libro={libro}
                    autor={autorNombre(libro.autor_id)}
                    genero={generoNombre(libro.genero_id)}
                    onOpen={() => setLibroAbierto(libro)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {libroAbierto && (
        <BookOpenModal
          key={libroAbierto.id}
          libro={libroAbierto}
          autor={autorNombre(libroAbierto.autor_id)}
          genero={generoNombre(libroAbierto.genero_id)}
          editorial={editorialNombre(libroAbierto.editorial_id)}
          onClose={() => setLibroAbierto(null)}
        />
      )}
    </div>
  );
}