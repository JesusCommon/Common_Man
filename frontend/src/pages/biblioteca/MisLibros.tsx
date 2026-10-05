import { useState } from "react";
import { useMisLibros, useAutoresPublicos, usePrepararLectura } from "@/hooks";
import { BookReaderModal } from "@/components/biblioteca/BookReaderModal";
import { Library, BookOpen, Loader2 } from "lucide-react";
import { extraerMensajeError } from "@/lib/errors";
import type { LibroResponse } from "@/api/types";

export default function MisLibros() {
  const { data: libros, isLoading } = useMisLibros();
  const { data: autores } = useAutoresPublicos();
  const prepararLectura = usePrepararLectura();
  const [lectorAbierto, setLectorAbierto] = useState(false);
  const [urlLectura, setUrlLectura] = useState("");
  const [tituloLectura, setTituloLectura] = useState("");
  const [errorLectura, setErrorLectura] = useState<string | null>(null);

  const autorNombre = (autorId: string) => {
    const a = autores?.find((x) => x.id === autorId);
    if (!a) return "Autor desconocido";
    return `${a.nombre} ${a.apellido ?? ""}`.trim();
  };

  const handleLeer = async (libro: LibroResponse) => {
    setErrorLectura(null);
    try {
      const data = await prepararLectura.mutateAsync(libro.id);
      setTituloLectura(libro.nombre);
      setUrlLectura(data.url_lectura);
      setLectorAbierto(true);
    } catch (err) {
      setErrorLectura(extraerMensajeError(err));
    }
  };

  const libroEnProceso = prepararLectura.isPending
    ? libros?.find((l) => l.id === prepararLectura.variables)
    : null;

  return (
    <div className="bg-[#f3eee5] text-[#221e19] rounded-3xl p-6 sm:p-10 lg:p-14 space-y-10">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b23a2f] font-semibold">
          Tu estantería personal
        </p>
        <h1 className="font-editorial mt-3 text-4xl sm:text-5xl font-semibold leading-[1.05]">
          Mis Libros
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8b8377]">
          Todos los libros que has comprado, listos para leer en cualquier momento.
        </p>
      </header>

      {errorLectura && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorLectura}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e4dccd] border-t-[#b23a2f]" />
        </div>
      ) : !libros || libros.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Library className="w-12 h-12 text-[#e4dccd] mb-4" />
          <h3 className="font-editorial text-xl font-semibold">Aún no tienes libros</h3>
          <p className="mt-1 text-sm text-[#8b8377]">
            Explora la biblioteca y compra tu primer libro para verlo aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {libros.map((libro) => {
            const estaProcesando = libroEnProceso?.id === libro.id;
            return (
              <div key={libro.id} className="group flex flex-col">
                <div className="relative aspect-2/3 rounded-l-sm rounded-r-xl overflow-hidden bg-[#2e2a24] shadow-[0_10px_24px_rgba(34,30,25,0.14)] transition-shadow group-hover:shadow-[0_24px_48px_rgba(34,30,25,0.24)]">
                  {libro.portada ? (
                    <img
                      src={libro.portada}
                      alt={libro.nombre}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-editorial absolute inset-0 flex items-center justify-center text-6xl text-[#f3eee5] bg-linear-to-br from-[#3a352d] to-[#221e19]">
                      {libro.nombre.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 z-10 bg-linear-to-r from-black/30 to-transparent" />
                </div>

                <h3 className="font-editorial mt-3 text-sm font-semibold leading-snug line-clamp-2 min-h-[2.4rem]">
                  {libro.nombre}
                </h3>
                <p className="mt-1 text-xs text-[#8b8377] truncate">
                  {autorNombre(libro.autor_id)}
                </p>

                <button
                  onClick={() => handleLeer(libro)}
                  disabled={prepararLectura.isPending}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#221e19] px-4 py-2 text-xs font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors disabled:opacity-50"
                >
                  {estaProcesando ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                  {estaProcesando ? "Preparando…" : "Leer ahora"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {lectorAbierto && (
        <BookReaderModal
          titulo={tituloLectura}
          urlLectura={urlLectura}
          onClose={() => setLectorAbierto(false)}
        />
      )}
    </div>
  );
}