import { useAutoresPublicos, useEditorialesPublicas, useGenerosPublicos } from "@/hooks";
import { RotateCcw } from "lucide-react";
import type { FiltrosBibliotecaValues } from "./filtros.shared";

interface FiltrosBibliotecaProps {
  values: FiltrosBibliotecaValues;
  onChange: (patch: Partial<FiltrosBibliotecaValues>) => void;
  onLimpiar: () => void;
  activo: boolean;
  totalResultados: number;
}

const IDIOMAS = ["Español", "Ingles", "Portugues"];

export function FiltrosBiblioteca({
  values,
  onChange,
  onLimpiar,
  activo,
  totalResultados,
}: FiltrosBibliotecaProps) {
  const { data: autores } = useAutoresPublicos();
  const { data: editoriales } = useEditorialesPublicas();
  const { data: generos } = useGenerosPublicos();

  const selectCls =
    "bg-transparent border-b border-[#e4dccd] px-1 py-1.5 text-sm text-[#52525B] " +
    "focus:outline-none focus:border-[#b23a2f] transition-colors cursor-pointer max-w-[190px]";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="text-xs uppercase tracking-[0.2em] text-[#8b8377] font-semibold">
        Refinar
      </span>

      <select
        value={values.autor_id}
        onChange={(e) => onChange({ autor_id: e.target.value })}
        className={selectCls}
      >
        <option value="">Todos los autores</option>
        {autores?.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre} {a.apellido}
          </option>
        ))}
      </select>

      <select
        value={values.genero_id}
        onChange={(e) => onChange({ genero_id: e.target.value })}
        className={selectCls}
      >
        <option value="">Todos los géneros</option>
        {generos?.map((g) => (
          <option key={g.id} value={g.id}>
            {g.nombre}
          </option>
        ))}
      </select>

      <select
        value={values.editorial_id}
        onChange={(e) => onChange({ editorial_id: e.target.value })}
        className={selectCls}
      >
        <option value="">Todas las editoriales</option>
        {editoriales?.map((ed) => (
          <option key={ed.id} value={ed.id}>
            {ed.nombre}
          </option>
        ))}
      </select>

      <select
        value={values.idioma}
        onChange={(e) => onChange({ idioma: e.target.value })}
        className={selectCls}
      >
        <option value="">Todos los idiomas</option>
        {IDIOMAS.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      {activo && (
        <>
          <span className="text-xs text-[#8b8377]">
            {totalResultados} {totalResultados === 1 ? "resultado" : "resultados"}
          </span>
          <button
            onClick={onLimpiar}
            className="flex items-center gap-1.5 text-xs text-[#b23a2f] hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        </>
      )}
    </div>
  );
}