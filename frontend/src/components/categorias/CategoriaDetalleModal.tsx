import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Folder,
  Fingerprint,
  Copy,
  Check,
  FileText,
  CalendarDays,
  Pencil,
} from "lucide-react";
import type { CategoriaResponse } from "@/api/types";

interface Props {
  categoria: CategoriaResponse;
  onClose: () => void;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function CategoriaDetalleModal({ categoria, onClose }: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(categoria.id)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => setCopied(false));
  };

  const handleEdit = () => {
    onClose();
    navigate(`/admin/categoriasProductos/editar/${categoria.id}`);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalle de Categoría">
      <div className="space-y-5">
        {/* Header: icono + nombre */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900 truncate">
              {categoria.nombre}
            </p>
            <p className="text-sm text-gray-500">Categoría de producto</p>
          </div>
        </div>

        {/* ID MongoDB con copiar */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <Fingerprint className="w-4 h-4" />
              ID MongoDB
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-sm font-mono text-gray-800 break-all">{categoria.id}</p>
        </div>

        {/* Descripción */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            <FileText className="w-4 h-4" />
            Descripción
          </span>
          <p className="text-sm text-gray-800">
            {categoria.descripcion || "Sin descripción."}
          </p>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <CalendarDays className="w-4 h-4" />
              Creado
            </span>
            <p className="text-sm text-gray-500">
              {formatDate(categoria.fecha_creacion)}
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <CalendarDays className="w-4 h-4" />
              Actualizado
            </span>
            <p className="text-sm text-gray-500">
              {formatDate(categoria.fecha_actualizacion)}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div>
          <StatusBadge active={categoria.activo} />
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="button" variant="primary" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar Categoría
          </Button>
        </div>
      </div>
    </Modal>
  );
}