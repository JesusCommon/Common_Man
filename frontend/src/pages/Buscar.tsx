import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBuscarPersonas } from "@/hooks";
import { Search, AlertCircle } from "lucide-react";

type CampoBusqueda = "nombre" | "apellido" | "username";

export default function Buscar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCampo = (searchParams.get("campo") as CampoBusqueda) || "nombre";

  const [query, setQuery] = useState(initialQ);
  const [campo, setCampo] = useState<CampoBusqueda>(initialCampo);

  const params = initialQ ? { [initialCampo]: initialQ, limit: 20 } : undefined;

  const { data: resultados, isLoading, isError, error } = useBuscarPersonas(params);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim(), campo });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Buscar personas</h1>
        <p className="text-slate-500 text-sm">Encuentra usuarios por nombre, apellido o username.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
          />
        </div>
        <select
          value={campo}
          onChange={(e) => setCampo(e.target.value as CampoBusqueda)}
          className="h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
        >
          <option value="nombre">Nombre</option>
          <option value="apellido">Apellido</option>
          <option value="username">Username</option>
        </select>
      </form>

      {initialQ && (
        <p className="text-sm text-slate-500">
          Buscando "<span className="text-slate-300">{initialQ}</span>" en{" "}
          <span className="text-slate-300 capitalize">{initialCampo}</span>
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{(error as Error)?.message || "Error al buscar"}</p>
        </div>
      )}

      {resultados && resultados.length === 0 && initialQ && (
        <p className="text-slate-500 text-sm">
          No se encontraron resultados para "<span className="text-slate-300">{initialQ}</span>".
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resultados?.map((persona) => (
          <div
            key={persona.identificador}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              {persona.avatar ? (
                <img
                  src={persona.avatar}
                  alt={persona.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold">
                  {persona.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-white text-sm">
                  {persona.nombre} {persona.apellido || ""}
                </p>
                <p className="text-xs text-slate-500">@{persona.username}</p>
              </div>
            </div>
            {persona.bio && <p className="text-xs text-slate-400 line-clamp-2">{persona.bio}</p>}
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${persona.activo ? "bg-emerald-400" : "bg-slate-600"}`} />
              <span className="text-xs text-slate-500">{persona.activo ? "Activo" : "Inactivo"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}