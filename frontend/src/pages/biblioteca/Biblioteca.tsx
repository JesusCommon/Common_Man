import { useMemo, useRef, useState } from "react";
import { useBuscarLibros, useAutoresPublicos, useGenerosPublicos } from "@/hooks";
import { AlphabetBar } from "@/components/biblioteca/AlfabetoBar";
import { BookCard } from "@/components/biblioteca/BookCard";
import { BookOpenModal } from "@/components/biblioteca/BookOpenModal";
import { BookMarked } from "lucide-react";
import type { LibroResponse } from "@/api/types";

const normalizarInicial = (titulo: string): string => {
  const limpio = titulo
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const ch = limpio.charAt(0).toUpperCase();
  return /^[A-Z]$/.test(ch) ? ch : "#";
};

export default function Biblioteca() {
  const { data, isLoading } = useBuscarLibros({ limit: 100 });
  const { data: autores } = useAutoresPublicos();
  const { data: generos } = useGenerosPublicos();

  const [libroAbierto, setLibroAbierto] = useState<LibroResponse | null>(null);
  const [letraActiva, setLetraActiva] = useState("");
  const seccionesRef = useRef<Record<string, HTMLElement | null>>({});
  const libros = useMemo(() => data?.items ?? [], [data?.items]);

  const autorNombre = (id: string) => {
    const a = autores?.find((x) => x.id === id);
    return a ? `${a.nombre} ${a.apellido ?? ""}`.trim() : "Autor desconocido";
  };
  const generoNombre = (id: string) =>
    generos?.find((g) => g.id === id)?.nombre ?? "";

  const secciones = useMemo(() => {
    const map = new Map<string, LibroResponse[]>();
    const ordenados = [...libros].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
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

  const saltarALetra = (letra: string) => {
    setLetraActiva(letra);
    if (letra === "") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    seccionesRef.current[letra]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
        <p className="mt-6 text-xs text-[#8b8377]">
          {libros.length} libros · {new Set(libros.map((l) => l.autor_id)).size} autores ·{" "}
          {new Set(libros.map((l) => l.genero_id)).size} géneros
        </p>
      </header>

      <AlphabetBar
        disponibles={letrasDisponibles}
        activa={letraActiva}
        onJump={saltarALetra}
      />

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e4dccd] border-t-[#b23a2f]" />
        </div>
      ) : secciones.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <BookMarked className="w-12 h-12 text-[#e4dccd] mb-4" />
          <h3 className="font-editorial text-xl font-semibold">La biblioteca está vacía</h3>
          <p className="mt-1 text-sm text-[#8b8377]">
            Aún no hay libros publicados en el catálogo.
          </p>
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
          onClose={() => setLibroAbierto(null)}
        />
      )}
    </div>
  );
}