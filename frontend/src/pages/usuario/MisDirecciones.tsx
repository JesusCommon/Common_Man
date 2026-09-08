import { useState } from "react";
import {
  useListarMisDirecciones,
  useMarcarDireccionPredeterminada,
  useEliminarDireccion,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { DireccionFormModal } from "@/components/direcciones/DireccionFormModal";
import { MapPin, Plus, Pencil, Trash2, Star, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DireccionResponse } from "@/api/types";

export default function MisDirecciones() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<DireccionResponse | null>(null);

  const query = useListarMisDirecciones({ skip: 0, limit: 100 });
  const marcarPredeterminada = useMarcarDireccionPredeterminada();
  const eliminar = useEliminarDireccion();

  const abrirNueva = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const abrirEditar = (d: DireccionResponse) => {
    setSelected(d);
    setModalOpen(true);
  };

  const handleEliminar = (d: DireccionResponse) => {
    if (!confirm(`¿Eliminar la dirección "${d.alias}"?`)) return;
    eliminar.mutate(d.id);
  };

  if (query.isLoading) return <Spinner />;
  if (query.isError) return <ErrorAlert error={query.error} fallback="Error al cargar tus direcciones" />;

  const direcciones = query.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Direcciones</h1>
          <p className="text-gray-500 text-sm">Administra tus direcciones de entrega.</p>
        </div>
        <Button variant="primary" onClick={abrirNueva}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Dirección
        </Button>
      </div>

      {direcciones.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center space-y-3">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-sm">Aún no tienes direcciones registradas.</p>
          <Button variant="primary" onClick={abrirNueva}>
            Agregar mi primera dirección
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {direcciones.map((d) => (
            <div
              key={d.id}
              className={cn(
                "bg-white border rounded-2xl p-5 shadow-sm space-y-3 flex flex-col",
                d.es_predeterminada
                  ? "border-blue-300 ring-1 ring-blue-200"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{d.alias}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                      <User className="w-3 h-3 shrink-0" />
                      {d.nombre_destinatario}
                    </p>
                  </div>
                </div>
                {d.es_predeterminada && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap">
                    Predeterminada
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1 flex-1">
                <p>
                  {d.direccion}
                  {d.complemento ? `, ${d.complemento}` : ""}
                </p>
                <p>
                  {d.barrio ? `${d.barrio}, ` : ""}
                  {d.ciudad}, {d.departamento}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" />
                  {d.telefono}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                {!d.es_predeterminada && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => marcarPredeterminada.mutate(d.id)}
                    disabled={marcarPredeterminada.isPending}
                    title="Marcar como predeterminada"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => abrirEditar(d)} title="Editar">
                  <Pencil className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEliminar(d)}
                  disabled={eliminar.isPending}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <DireccionFormModal
          key={selected?.id ?? "nueva"}
          direccion={selected}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}