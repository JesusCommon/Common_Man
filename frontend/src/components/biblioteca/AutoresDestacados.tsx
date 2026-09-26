import { useAutoresDestacados } from "@/hooks";

interface AutoresDestacadosProps {
  activoId: string;
  onSelect: (id: string) => void;
}

export function AutoresDestacados({ activoId, onSelect }: AutoresDestacadosProps) {
  const { data, isLoading } = useAutoresDestacados(8);

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        <h2 className="font-editorial text-xl font-semibold text-[#221e19]">
          Voces destacadas
        </h2>
        <span className="flex-1 h-px bg-[#e4dccd]" />
        <span className="text-xs text-[#8b8377]">Los autores con más obras</span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2">
        {data.map((autor) => {
          const activo = activoId === autor.id;
          const nombreCompleto = `${autor.nombre} ${autor.apellido ?? ""}`.trim();
          return (
            <button
              key={autor.id}
              onClick={() => onSelect(activo ? "" : autor.id)}
              title={activo ? "Quitar filtro de autor" : `Ver libros de ${nombreCompleto}`}
              className="group flex flex-col items-center gap-2 shrink-0 w-24"
            >
              <div
                className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  activo
                    ? "border-[#b23a2f] ring-4 ring-[#b23a2f]/20 scale-105"
                    : "border-[#e4dccd] group-hover:border-[#b23a2f]/60 group-hover:-translate-y-1"
                }`}
              >
                {autor.imagen ? (
                  <img
                    src={autor.imagen}
                    alt={nombreCompleto}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-editorial w-full h-full flex items-center justify-center text-2xl font-semibold text-[#f3eee5] bg-linear-to-br from-[#8b8377] to-[#221e19]">
                    {autor.nombre.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-medium text-center leading-tight line-clamp-2 transition-colors ${
                  activo ? "text-[#b23a2f]" : "text-[#221e19]"
                }`}
              >
                {nombreCompleto}
              </p>
              <span className="text-[10px] text-[#8b8377]">
                {autor.total_libros} {autor.total_libros === 1 ? "libro" : "libros"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}