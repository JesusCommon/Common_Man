import { useState } from "react";
import { useObtenerCategoriaPorId } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Folder, Search, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminBuscarCategoria() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const obtener = useObtenerCategoriaPorId(searchId ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setSearchId(trimmed);
  };

  const handleClear = () => {
    setQuery("");
    setSearchId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buscar Categoría</h1>
        <p className="text-gray-500 text-sm">
          Busca una categoría por su ID de MongoDB.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <TextField
              label="ID de Categoría"
              value={query}
              onChange={setQuery}
              placeholder="Ej: 65a1b2c3d4e5f6g7h8i9j0k1"
              icon={Search}
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" variant="primary">
              Buscar
            </Button>
            {searchId && (
              <Button type="button" variant="ghost" onClick={handleClear}>
                Limpiar
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Resultados */}
      {searchId && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-2xl">
          {obtener.isLoading && <Spinner />}
          
          {obtener.isError && (
            <ErrorAlert
              error={obtener.error}
              fallback="No se encontró la categoría con ese ID."
            />
          )}

          {obtener.data && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {obtener.data.nombre}
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">
                      ID: {obtener.data.id}
                    </p>
                  </div>
                </div>
                <StatusBadge active={obtener.data.activo} />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 text-sm">
                  {obtener.data.descripcion || "Sin descripción."}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`/admin/categoriasProductos/editar/${obtener.data!.id}`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Categoría
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}