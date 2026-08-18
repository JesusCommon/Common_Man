import { useState } from "react";
import type { FormEvent } from "react";
import { useObtenerPorObjectId, useObtenerPorUUID } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { SegmentedOption } from "@/components/ui/SegmentedControl";
import { Alert } from "@/components/ui/Alert";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UsuarioDetalle } from "@/components/usuarios/UsuarioDetalle";

type SearchType = "auto" | "objectid" | "uuid";
type DetectedType = "objectid" | "uuid" | null;

const searchOptions: SegmentedOption<SearchType>[] = [
  { key: "auto", label: "Auto detectar" },
  { key: "objectid", label: "MongoDB ID" },
  { key: "uuid", label: "UUID" },
];

const formatWarnings: Record<SearchType, string> = {
  auto: "El formato no coincide con un ID de MongoDB (24 hex) ni un UUID. Verifica el valor.",
  objectid: "El formato no coincide con un ID de MongoDB (24 caracteres hexadecimales).",
  uuid: "El formato no coincide con un UUID válido.",
};

const isUUID = (str: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const isObjectId = (str: string): boolean => /^[0-9a-f]{24}$/i.test(str);

const determineType = (str: string, searchType: SearchType): DetectedType => {
  if (searchType === "objectid") return isObjectId(str) ? "objectid" : null;
  if (searchType === "uuid") return isUUID(str) ? "uuid" : null;
  if (isObjectId(str)) return "objectid";
  if (isUUID(str)) return "uuid";
  return null;
};

export default function AdminBuscar() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("auto");
  const [searched, setSearched] = useState(false);

  const trimmed = query.trim();
  const type = determineType(trimmed, searchType);

  // Solo se habilita la query cuando el usuario ejecutó la búsqueda
  const byId = useObtenerPorObjectId(searched && type === "objectid" ? trimmed : undefined);
  const byUUID = useObtenerPorUUID(searched && type === "uuid" ? trimmed : undefined);

  const activeQuery = type === "objectid" ? byId : type === "uuid" ? byUUID : null;
  const result = searched ? activeQuery?.data : undefined;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const resetSearch = () => setSearched(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Buscar por ID</h1>
        <p className="text-slate-500 text-sm">Encuentra un usuario por su ID de MongoDB o UUID.</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              resetSearch();
            }}
            placeholder="Pega el ID o UUID aquí..."
            mono
          />
          <Button type="submit" variant="primary" className="h-11 px-6">
            Buscar
          </Button>
        </div>

        <SegmentedControl
          options={searchOptions}
          value={searchType}
          onChange={(key) => {
            setSearchType(key);
            resetSearch();
          }}
        />
      </form>

      {searched && !type && <Alert variant="warning" message={formatWarnings[searchType]} />}

      {searched && activeQuery?.isLoading && <Spinner size="sm" />}

      {searched && activeQuery?.isError && (
        <ErrorAlert error={activeQuery.error} fallback="Usuario no encontrado" />
      )}

      {result && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-4">
            <Avatar name={result.nombre} size="lg" variant="primary" />
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
              <StatusBadge active={result.activo} />
            </span>
          </div>

          <UsuarioDetalle usuario={result} />
        </div>
      )}
    </div>
  );
}