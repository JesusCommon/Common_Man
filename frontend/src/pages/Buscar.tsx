import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useBuscarPersonas } from "@/hooks";
import { Search, X, AlertCircle, ArrowRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Buscar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);

  // Mínimo 1 char para buscar (tu backend maneja bien los símbolos, solo evitamos vacío)
  const valid = initialQ.trim().length > 0;

  // 3 búsquedas paralelas en nombre, apellido y username
  const nombreQ = useBuscarPersonas(valid ? { nombre: initialQ, limit: 20 } : undefined);
  const apellidoQ = useBuscarPersonas(valid ? { apellido: initialQ, limit: 20 } : undefined);
  const usernameQ = useBuscarPersonas(valid ? { username: initialQ, limit: 20 } : undefined);

  // Unimos resultados únicos por identificador
  const resultados = useMemo(() => {
    if (!valid) return [];
    const map = new Map();
    [nombreQ.data, apellidoQ.data, usernameQ.data].forEach((arr) => {
      arr?.forEach((item) => map.set(item.identificador, item));
    });
    return Array.from(map.values());
  }, [nombreQ.data, apellidoQ.data, usernameQ.data, valid]);

  const isLoading = nombreQ.isLoading || apellidoQ.isLoading || usernameQ.isLoading;
  const hasError = nombreQ.isError && apellidoQ.isError && usernameQ.isError;
  const anyError = nombreQ.isError || apellidoQ.isError || usernameQ.isError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Buscar personas</h1>
        <p className="text-slate-500 text-sm">
          Escribe un nombre, apellido o username. Buscamos en todos los campos a la vez.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Oscar, Pineda, oscarpineda123..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Info resultados */}
      {valid && (
        <p className="text-sm text-slate-500">
          {isLoading ? "Buscando..." : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`} para "
          <span className="text-slate-300">{initialQ}</span>"
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error (solo si los 3 fallaron) */}
      {hasError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            {(nombreQ.error as Error)?.message || "Error al buscar"}
          </p>
        </div>
      )}

      {/* Warning parcial */}
      {!hasError && anyError && resultados.length > 0 && (
        <p className="text-xs text-amber-400/80">
          Algunas búsquedas fallaron, mostrando resultados parciales.
        </p>
      )}

      <AnimatePresence mode="popLayout">
        {/* Vacío */}
        {valid && !isLoading && resultados.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30"
          >
            <Users className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">
              No se encontraron resultados para "
              <span className="text-slate-300">{initialQ}</span>".
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Intenta con otro nombre, apellido o username.
            </p>
          </motion.div>
        )}

        {/* Resultados clickeables */}
        {resultados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resultados.map((persona, index) => (
              <motion.div
                key={persona.identificador}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                onClick={() => navigate(`/perfil/${persona.username}`)}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {persona.avatar ? (
                    <img
                      src={persona.avatar}
                      alt={persona.nombre}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-blue-500/30 transition-all"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold ring-2 ring-slate-800 group-hover:ring-blue-500/30 transition-all">
                      {persona.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors truncate">
                      {persona.nombre} {persona.apellido || ""}
                    </p>
                    <p className="text-xs text-slate-500 truncate">@{persona.username}</p>
                  </div>
                </div>

                {persona.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{persona.bio}</p>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      persona.activo ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                  <span className="text-xs text-slate-500">
                    {persona.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}