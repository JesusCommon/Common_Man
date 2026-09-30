import { useMisLibros, useAutoresPublicos } from "@/hooks";
import { obtenerContenidoLibroService } from "@/services";
import { Library, BookOpen } from "lucide-react";
import { useState } from "react";
import type { LibroResponse } from "@/api/types";

export default function MisLibros() {
  const { data: libros, isLoading } = useMisLibros();
  const { data: autores } = useAutoresPublicos();
  const [leyendoId, setLeyendoId] = useState<string | null>(null);

  const autorNombre = (id: string) => {
    const a = autores?.find((x) => x.id === id);
    return a ? `${a.nombre} ${a.apellido ?? ""}`.trim() : "Autor desconocido";
  };

  const handleLeer = async (libro: LibroResponse) => {
    setLeyendoId(libro.id);
    try {
      const res = await obtenerContenidoLibroService(libro.id);
      if (res.success) {
        window.open(String(res.data.contenido), "_blank");
      }
    } finally {
      setLeyendoId(null);
    }
  };

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
          {libros.map((libro) => (
            <div key={libro.id} className="group flex flex-col">
              <div className="relative aspect-2/3 rounded-l-sm rounded-r-xl overflow-hidden bg-[#2e2a24] shadow-[0_10px_24px_rgba(34,30,25,0.14)] transition-shadow group-hover:shadow-[0_24px_48px_rgba(34,30,25,0.24)]">
                {libro.portada ? (
                  <img src={libro.portada} alt={libro.nombre} className="absolute inset-0 w-full h-full object-cover" />
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
              <p className="mt-1 text-xs text-[#8b8377] truncate">{autorNombre(libro.autor_id)}</p>

              <button
                onClick={() => handleLeer(libro)}
                disabled={leyendoId === libro.id}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#221e19] px-4 py-2 text-xs font-medium text-[#f3eee5] hover:bg-[#b23a2f] transition-colors disabled:opacity-50"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {leyendoId === libro.id ? "Abriendo…" : "Leer ahora"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}