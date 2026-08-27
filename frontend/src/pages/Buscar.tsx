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
  const valid = initialQ.trim().length > 0;

  const nombreQ = useBuscarPersonas(valid ? { nombre: initialQ, limit: 20 } : undefined);
  const apellidoQ = useBuscarPersonas(valid ? { apellido: initialQ, limit: 20 } : undefined);
  const usernameQ = useBuscarPersonas(valid ? { username: initialQ, limit: 20 } : undefined);

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
    if (query.trim()) setSearchParams({ q: query.trim() });
    else setSearchParams({});
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#18181B] mb-1">Buscar personas</h1>
        <p className="text-[#52525B] text-sm">Escribe un nombre, apellido o username.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A19A]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Oscar, Pineda, oscarpineda123..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A19A] hover:text-[#18181B] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {valid && (
        <p className="text-sm text-[#52525B]">
          {isLoading ? "Buscando..." : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`} para "
          <span className="text-[#18181B] font-medium">{initialQ}</span>"
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-[#E4E4E1] border-t-[#18181B] rounded-full animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-4">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{(nombreQ.error as Error)?.message || "Error al buscar"}</p>
        </div>
      )}

      {!hasError && anyError && resultados.length > 0 && (
        <p className="text-xs text-amber-600">Algunas búsquedas fallaron, mostrando resultados parciales.</p>
      )}

      <AnimatePresence mode="popLayout">
        {valid && !isLoading && resultados.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#E4E4E1] rounded-2xl bg-[#FAFAF8]">
            <Users className="w-10 h-10 text-[#A1A19A] mb-3" />
            <p className="text-[#52525B] text-sm">No se encontraron resultados para "<span className="text-[#18181B] font-medium">{initialQ}</span>".</p>
          </motion.div>
        )}

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
                className="group relative rounded-xl border border-[#E4E4E1] bg-white p-5 hover:border-[#2563EB]/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  {persona.avatar ? (
                    <img src={persona.avatar} alt={persona.nombre} className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FAFAF8] group-hover:ring-[#2563EB]/20 transition-all" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold ring-2 ring-[#FAFAF8] group-hover:ring-[#2563EB]/20 transition-all">
                      {persona.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#18181B] text-sm group-hover:text-[#2563EB] transition-colors truncate">{persona.nombre} {persona.apellido || ""}</p>
                    <p className="text-xs text-[#A1A19A] truncate">@{persona.username}</p>
                  </div>
                </div>
                {persona.bio && <p className="text-xs text-[#52525B] line-clamp-2 mb-3">{persona.bio}</p>}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${persona.activo ? "bg-emerald-500" : "bg-[#D4D4CE]"}`} />
                  <span className="text-xs text-[#A1A19A]">{persona.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}