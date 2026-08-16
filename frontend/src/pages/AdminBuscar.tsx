import { useState } from "react";
import { useObtenerPorObjectId, useObtenerPorUUID } from "@/hooks";
import { Button } from "@/components/ui/Button";
import {
  Search,
  AlertCircle,
  Copy,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Wallet,
  Shield,
  Fingerprint,
  Calendar,
  User,
} from "lucide-react";
import type { UsuarioAdminResponse } from "@/api/types";

export default function AdminBuscar() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"auto" | "objectid" | "uuid">("auto");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const isObjectId = (str: string) => /^[0-9a-f]{24}$/i.test(str);

  const determineType = (str: string): "objectid" | "uuid" | null => {
    if (searchType === "objectid") return isObjectId(str) ? "objectid" : null;
    if (searchType === "uuid") return isUUID(str) ? "uuid" : null;
    if (isObjectId(str)) return "objectid";
    if (isUUID(str)) return "uuid";
    return null;
  };

  const type = determineType(query.trim());
  const enabled = searched && !!type;

  const byId = useObtenerPorObjectId(type === "objectid" ? query.trim() : undefined);
  const byUUID = useObtenerPorUUID(type === "uuid" ? query.trim() : undefined);

  const result: UsuarioAdminResponse | undefined =
    type === "objectid" ? byId.data : type === "uuid" ? byUUID.data : undefined;

  const isLoading = type === "objectid" ? byId.isLoading : type === "uuid" ? byUUID.isLoading : false;
  const isError = type === "objectid" ? byId.isError : type === "uuid" ? byUUID.isError : false;
  const error = type === "objectid" ? byId.error : type === "uuid" ? byUUID.error : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Buscar por ID</h1>
        <p className="text-slate-500 text-sm">Encuentra un usuario por su ID de MongoDB o UUID.</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              placeholder="Pega el ID o UUID aquí..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 font-mono text-sm"
            />
          </div>
          <Button type="submit" variant="primary" className="h-11 px-6">
            Buscar
          </Button>
        </div>

        <div className="flex gap-3 text-xs">
          {[
            { key: "auto" as const, label: "Auto detectar" },
            { key: "objectid" as const, label: "MongoDB ID" },
            { key: "uuid" as const, label: "UUID" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setSearchType(opt.key);
                setSearched(false);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                searchType === opt.key
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                  : "border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </form>

      {searched && !type && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            El formato no coincide con un ID de MongoDB (24 hex) ni un UUID. Verifica el valor.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{(error as Error)?.message || "Usuario no encontrado"}</p>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {result.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {result.nombre} {result.apellido || ""}
              </h2>
              <p className="text-sm text-slate-500">@{result.username}</p>
            </div>
            <span
              className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                result.activo
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {result.activo ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {result.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  ID MongoDB
                </span>
                <button
                  onClick={() => handleCopy(result.id)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
              <code className="text-sm text-slate-300 font-mono break-all">{result.id}</code>
            </div>

            <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  UUID
                </span>
                <button
                  onClick={() => handleCopy(result.identificador)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </button>
              </div>
              <code className="text-sm text-slate-300 font-mono break-all">{result.identificador}</code>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Correo
                </p>
                <p className="text-sm text-white font-medium">{result.correo}</p>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Teléfono
                </p>
                <p className="text-sm text-white font-medium">{result.telefono || "—"}</p>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> Saldo
                </p>
                <p className="text-sm text-emerald-400 font-bold">${result.saldo?.toLocaleString() || "0"}</p>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Rol
                </p>
                <p className="text-sm text-white font-medium capitalize">{result.rol}</p>
              </div>
            </div>

            {result.bio && (
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1">Bio</p>
                <p className="text-sm text-slate-300">{result.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Creado
                </p>
                <p className="text-sm text-slate-300">
                  {new Date(result.fecha_creacion).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Actualizado
                </p>
                <p className="text-sm text-slate-300">
                  {new Date(result.fecha_actualizacion).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}